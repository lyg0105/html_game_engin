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

    this_obj.player_arr = [];
    this_obj.monster_arr = [];

    let canvas_w = main.model.data.canvas.width;

    // 플레이어 유닛 생성 (선택된 캐릭터)
    select_char_arr.forEach(function (char, i) {
      this_obj.player_arr.push({
        x: 80,
        y: 100 + i * 80,
        w: char.w || 30,
        h: char.h || 50,
        hp: char.hp || 100,
        max_hp: char.hp || 100,
        attack: char.attack || 10,
        defense: char.defense || 5,
        move_speed: (char.move_speed || 1) * 1.5,
        name: char.name,
        job: char.job,
        race: char.race,
        is_player: true,
        color: "#4a90e2",
      });
    });

    // 몬스터 유닛 생성 (스테이지 데이터 기반)
    let monster_cnt = select_stage ? select_stage.monster_cnt : 5;
    let monster_race_arr = select_stage ? select_stage.monster_race_arr : ["고블린"];
    let monster_job_arr = select_stage ? select_stage.monster_job_arr : ["전사"];
    let monster_level = select_stage ? select_stage.monster_level : 1;

    for (let i = 0; i < monster_cnt; i++) {
      let race = monster_race_arr[i % monster_race_arr.length];
      let job = monster_job_arr[i % monster_job_arr.length];
      let base_hp = 60 + monster_level * 20;
      this_obj.monster_arr.push({
        x: canvas_w - 120,
        y: 80 + i * 60,
        w: 30,
        h: 40,
        hp: base_hp,
        max_hp: base_hp,
        attack: 5 + monster_level * 2,
        defense: 2 + monster_level,
        move_speed: 0.8,
        name: race,
        job: job,
        race: race,
        is_player: false,
        color: "#e94560",
      });
    }
  }
  update() {
    let this_obj = this;

    // 플레이어: 가장 가까운 살아있는 몬스터를 향해 이동 또는 공격
    this_obj.player_arr.forEach(function (p) {
      if (p.hp <= 0) return;
      let target = this_obj._nearest(p, this_obj.monster_arr);
      if (!target) return;
      let dx = target.x + target.w / 2 - (p.x + p.w / 2);
      let dy = target.y + target.h / 2 - (p.y + p.h / 2);
      let dist = Math.sqrt(dx * dx + dy * dy);
      let attack_range = p.w + target.w;
      if (dist > attack_range) {
        p.x += (dx / dist) * p.move_speed;
        p.y += (dy / dist) * p.move_speed;
      } else {
        // 공격 (프레임당 데미지)
        let dmg = Math.max(1, p.attack - target.defense) * 0.05;
        target.hp = Math.max(0, target.hp - dmg);
      }
    });

    // 몬스터: 가장 가까운 살아있는 플레이어를 향해 이동 또는 공격
    this_obj.monster_arr.forEach(function (m) {
      if (m.hp <= 0) return;
      let target = this_obj._nearest(m, this_obj.player_arr);
      if (!target) return;
      let dx = target.x + target.w / 2 - (m.x + m.w / 2);
      let dy = target.y + target.h / 2 - (m.y + m.h / 2);
      let dist = Math.sqrt(dx * dx + dy * dy);
      let attack_range = m.w + target.w;
      if (dist > attack_range) {
        m.x += (dx / dist) * m.move_speed;
        m.y += (dy / dist) * m.move_speed;
      } else {
        let dmg = Math.max(1, m.attack - target.defense) * 0.05;
        target.hp = Math.max(0, target.hp - dmg);
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

    [...this_obj.player_arr, ...this_obj.monster_arr].forEach(function (u) {
      ctx.save();

      // 죽은 유닛: 회색으로 표시
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
  }
}
export default UnitControl;
