class UnitControl {
  main;
  player_arr = [];
  monster_arr = [];

  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    let game_data = main.model.data.game_data;
    let select_char_arr = game_data.select_char_arr;
    let select_stage = game_data.select_stage;
    let game = main.model.data.page_obj;
    let map_w = game.data.map.w;
    let map_h = game.data.map.h;
    let char_list = main.model.data.object.common.char.data.char_list;
    let default_char = char_list.default_char;
    let race_gold = char_list.race_gold;

    this_obj.player_arr = [];
    this_obj.monster_arr = [];

    let sp = (select_stage && select_stage.start_point) ? select_stage.start_point : { x: 80, y: 100 };

    // 플레이어 유닛 생성 (선택된 캐릭터)
    select_char_arr.forEach(function (char, i) {
      this_obj.player_arr.push({
        ...default_char,
        ...char,
        x: sp.x,
        y: sp.y + i * 80,
        max_hp: char.hp || default_char.hp,
        move_speed: (char.move_speed || default_char.move_speed) * 1.5,
        is_player: true,
        color: "#4a90e2",
        attack_timer: 0,
      });
    });

    // 몬스터 유닛 생성 (스테이지 데이터 기반, 맵 오른쪽에 분산 배치)
    let monster_cnt = select_stage ? select_stage.monster_cnt : 5;
    let monster_race_arr = select_stage ? select_stage.monster_race_arr : ["고블린"];
    let monster_job_arr = select_stage ? select_stage.monster_job_arr : ["전사"];
    let monster_level = select_stage ? select_stage.monster_level : 1;
    let m_h = 40, m_gap = 10, col_gap = 60;
    let per_col = Math.max(1, Math.floor(map_h / (m_h + m_gap)));

    for (let i = 0; i < monster_cnt; i++) {
      let race = monster_race_arr[i % monster_race_arr.length];
      let job = monster_job_arr[i % monster_job_arr.length];
      let base_hp = (default_char.hp/10) + monster_level * 20;
      let rm = race_gold[race] || 1;
      let gold = Math.floor(10 * monster_level * rm);
      let col = Math.floor(i / per_col);
      let row = i % per_col;
      this_obj.monster_arr.push({
        ...default_char,
        x: map_w - 120 - col * col_gap,
        y: m_gap + row * (m_h + m_gap),
        h: 40,
        hp: base_hp,
        max_hp: base_hp,
        attack: (default_char.attack/10) + monster_level * 2,
        defense: default_char.defense + monster_level,
        move_speed: 0.8,
        name: race,
        job: job,
        race: race,
        is_player: false,
        color: "#e94560",
        gold: gold,
        attack_timer: 0,
      });
    }
  }
  update() {
    let this_obj = this;

    this_obj._update_side(this_obj.player_arr, this_obj.monster_arr);
    this_obj._update_side(this_obj.monster_arr, this_obj.player_arr);
  }
  _update_side(units, enemies) {
    let this_obj = this;
    units.forEach(function (u) {
      if (u.hp <= 0) return;
      let target = this_obj._nearest(u, enemies);
      if (!target) return;
      let dx = target.x + target.w / 2 - (u.x + u.w / 2);
      let dy = target.y + target.h / 2 - (u.y + u.h / 2);
      let dist = Math.sqrt(dx * dx + dy * dy);
      let touch = (u.w + u.h + target.w + target.h) / 4;
      let range_px = touch + u.attack_range * 10;
      u.attack_timer++;
      if (dist > range_px) {
        u.attack_timer = 0; // 범위 밖 이동 중 타이머 리셋
        u.x += (dx / dist) * u.move_speed;
        u.y += (dy / dist) * u.move_speed;
      } else {
        // 공격 쿨타임: 20프레임 = 1초, attack_speed번/초
        let cool = Math.max(1, Math.round(20 / u.attack_speed));
        if (u.attack_timer >= cool) {
          u.attack_timer = 0;
          let dmg = Math.max(1, u.attack - target.defense);
          target.hp = Math.max(0, target.hp - dmg);
        }
      }
    });
  }
  _nearest(unit, arr) {
    let best = null;
    let best_dist = Infinity;
    let cx = unit.x + unit.w / 2;
    let cy = unit.y + unit.h / 2;
    arr.forEach(function (other) {
      if (other.hp <= 0) return;
      let ox = other.x + other.w / 2;
      let oy = other.y + other.h / 2;
      let d = Math.sqrt((ox - cx) ** 2 + (oy - cy) ** 2);
      if (d < best_dist) {
        best_dist = d;
        best = other;
      }
    });
    return best;
  }
  render() {
    let this_obj = this;
    let main = this.main;
    let ctx = main.model.data.html.ctx;
    let game = main.model.data.page_obj;
    let cam = game.data.camera;

    ctx.save();
    ctx.translate(-cam.x, -cam.y);

    [...this_obj.player_arr, ...this_obj.monster_arr].forEach(function (u) {
      ctx.save();

      let dead = u.hp <= 0;
      ctx.globalAlpha = dead ? 0.3 : 1.0;

      // 몸통
      ctx.fillStyle = dead ? "#888" : u.color;
      ctx.fillRect(u.x, u.y, u.w, u.h);
      ctx.strokeStyle = dead ? "#555" : "#fff";
      ctx.lineWidth = 1;
      ctx.strokeRect(u.x, u.y, u.w, u.h);

      if (!dead) {
        // HP바 배경
        ctx.fillStyle = "#333";
        ctx.fillRect(u.x, u.y - 10, u.w, 6);
        // HP바
        let hp_ratio = u.hp / u.max_hp;
        ctx.fillStyle = hp_ratio > 0.5 ? "#2ecc71" : hp_ratio > 0.25 ? "#f5a623" : "#e74c3c";
        ctx.fillRect(u.x, u.y - 10, u.w * hp_ratio, 6);
      }

      // 이름/직업
      ctx.fillStyle = "#fff";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(u.name, u.x + u.w / 2, u.y - 11);

      ctx.restore();
    });

    ctx.restore();
  }
}
export default UnitControl;
