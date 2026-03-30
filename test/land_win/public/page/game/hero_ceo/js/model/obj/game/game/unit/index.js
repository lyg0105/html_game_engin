import RenderMiniChar from "./render/mini_char/index.js";
import { get_nearest } from "./calc/distance.js";
import { get_touch_range } from "./calc/collision.js";
import { calc_dmg, apply_dmg } from "./calc/damage.js";
import MissileControl from "./calc/missile.js";

class UnitControl {
  main;
  player_arr = [];
  monster_arr = [];
  missile_ctrl = new MissileControl();
  render_mini_char = null;

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
    this_obj.missile_ctrl.init();

    this_obj.render_mini_char = new RenderMiniChar(main);

    let sp = (select_stage && select_stage.start_point) ? select_stage.start_point : { x: 80, y: 100 };

    // 플레이어 유닛 생성 (선택된 캐릭터) - 왼쪽 세로 중앙 정렬
    let p_h = default_char.h || 40;
    let p_gap = 20;
    let p_total_h = select_char_arr.length * p_h + Math.max(0, select_char_arr.length - 1) * p_gap;
    let p_start_y = Math.round((map_h - p_total_h) / 2);

    select_char_arr.forEach(function (char, i) {
      this_obj.player_arr.push({
        ...default_char,
        ...char,
        x: sp.x,
        y: p_start_y + i * (p_h + p_gap),
        max_hp: char.hp || default_char.hp,
        move_speed: (char.move_speed || default_char.move_speed) * 1.5,
        is_player: true,
        color: "#4a90e2",
        attack_timer: 0,
        state_num: 0,
        _anim_tick: 0,
        _prev_state: "idle",
        _face_right: true, // 기본 오른쪽 바라봄
        sprite: "mini_char",
      });
    });

    // 몬스터 유닛 생성 (스테이지 데이터 기반, 맵 오른쪽 세로 중앙 정렬)
    let monster_cnt = select_stage ? select_stage.monster_cnt : 5;
    let monster_race_arr = select_stage ? select_stage.monster_race_arr : ["고블린"];
    let monster_job_arr = select_stage ? select_stage.monster_job_arr : ["전사"];
    let monster_level = select_stage ? select_stage.monster_level : 1;
    let m_h = 40, m_gap = 10, col_gap = 60;
    let per_col = Math.max(1, Math.floor(map_h / (m_h + m_gap)));

    for (let i = 0; i < monster_cnt; i++) {
      let race = monster_race_arr[i % monster_race_arr.length];
      let job = monster_job_arr[i % monster_job_arr.length];
      let base_hp = (default_char.hp / 10) + monster_level * 20;
      let rm = race_gold[race] || 1;
      let gold = Math.floor(10 * monster_level * rm);
      let col = Math.floor(i / per_col);
      let row = i % per_col;
      let col_count = Math.min(per_col, monster_cnt - col * per_col);
      let col_total_h = col_count * m_h + Math.max(0, col_count - 1) * m_gap;
      let m_start_y = Math.round((map_h - col_total_h) / 2);
      this_obj.monster_arr.push({
        ...default_char,
        x: map_w - 120 - col * col_gap,
        y: m_start_y + row * (m_h + m_gap),
        h: 40,
        hp: base_hp,
        max_hp: base_hp,
        attack: (default_char.attack / 10) + monster_level * 2,
        defense: default_char.defense + monster_level,
        move_speed: 0.8,
        name: race,
        job: job,
        race: race,
        is_player: false,
        color: "#e94560",
        gold: gold,
        attack_timer: 0,
        state_num: 0,
        _anim_tick: 0,
        _prev_state: "idle",
        _face_right: false, // 몬스터 기본 왼쪽 바라봄
      });
    }
  }
  update() {
    let this_obj = this;

    this_obj._update_side(this_obj.player_arr, this_obj.monster_arr);
    this_obj._update_side(this_obj.monster_arr, this_obj.player_arr);
    this_obj.missile_ctrl.update();
  }
  _update_side(units, enemies) {
    let this_obj = this;
    let main = this_obj.main;
    let char_list = main.model.data.object.common.char.data.char_list;
    let sprite_data = char_list.sprite_data;
    units.forEach(function (u) {
      u.state = "idle";
      if (u.hp <= 0) return;
      let target = get_nearest(u, enemies);
      if (!target) return;
      let dx = target.x + target.w / 2 - (u.x + u.w / 2);
      let dy = target.y + target.h / 2 - (u.y + u.h / 2);
      let dist = Math.sqrt(dx * dx + dy * dy);
      let range_px = get_touch_range(u, target) + u.attack_range * 10;
      
      u.attack_timer++;
      if (dist > range_px) {
        u.state = "move";
        u.attack_timer = 0; // 범위 밖 이동 중 타이머 리셋
        if (dx !== 0) u._face_right = dx > 0; // 이동 방향으로 바라보는 방향 갱신

        u.x += (dx / dist) * u.move_speed;
        u.y += (dy / dist) * u.move_speed;
      } else {
        u.state = "attack";
        
        // 공격 쿨타임: 20프레임 = 1초, attack_speed번/초
        let cool = Math.max(1, Math.round(20 / u.attack_speed));
        
        if (u.attack_timer >= cool) {
          u.attack_timer = 0;
          if (u.attack_type !== "melee") {
            // 투사체 발사 - 데미지는 투사체가 맞을 때 적용
            this_obj.missile_ctrl.push({
              x: u.x + u.w / 2,
              y: u.y + u.h / 2,
              target: target,
              enemies: enemies,
              attack_type: u.attack_type,
              explode_r: u.attack_radius || 80,
              speed: 6,
              dmg: calc_dmg(u, target),
              color: u.is_player ? "#4af" : "#f84",
              r: 5,
            });
            
          } else {
            apply_dmg(target, calc_dmg(u, target));
          }
        }
      }

      // 애니메이션 프레임 업데이트
      if (u.sprite == "hero") {
        let sd = sprite_data[u.sprite] || sprite_data.hero;
        let state_key = u.state === "move" ? "walk" : u.state;
        let frames = sd[state_key] || sd.idle;
        if (u._prev_state !== u.state) {
          u.state_num = 0;
          u._anim_tick = 0;
          u._prev_state = u.state;
        }
        u._anim_tick++;
        if (u._anim_tick >= 4) {
          u._anim_tick = 0;
          u.state_num = (u.state_num + 1) % frames.length;
        }
      } else if (u.sprite == "mini_char") {
        if (u._prev_state !== u.state) {
          u._anim_tick = 0;
          u._prev_state = u.state;
        }
        u._anim_tick++;
      }

    });
  }
  render() {
    let this_obj = this;
    let main = this.main;
    let ctx = main.model.data.html.ctx;
    let game = main.model.data.page_obj;
    let cam = game.data.camera;
    let off = game.data.map_offset;
    let char_list = main.model.data.object.common.char.data.char_list;
    let sprite_data = char_list.sprite_data;
    let hero_img = main.model.data.res.img.hero;

    ctx.save();
    ctx.translate(off.x - cam.x, off.y - cam.y);

    [...this_obj.player_arr, ...this_obj.monster_arr].forEach(function (u) {
      ctx.save();

      let dead = u.hp <= 0;
      ctx.globalAlpha = dead ? 0.3 : 1.0;

      // 스프라이트 이미지 그리기
      if (u.sprite == "hero" && hero_img && hero_img.complete) {
        let sd = sprite_data[u.sprite] || sprite_data.hero;
        let state_key = u.state === "move" ? "walk" : u.state;
        let frames = sd[state_key] || sd.idle;
        let frame = frames[u.state_num % frames.length];
        let sx = frame.x * sd.w;
        let sy = frame.y * sd.h;

        // _face_right: true=오른쪽(기본), false=왼쪽(반전)
        if (u._face_right) {
          ctx.drawImage(hero_img, sx, sy, sd.w, sd.h, u.x, u.y, u.w, u.h);
        } else {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(hero_img, sx, sy, sd.w, sd.h, -(u.x + u.w), u.y, u.w, u.h);
          ctx.restore();
        }
      } else if (u.sprite == "mini_char") {
        this_obj.render_mini_char.render_char({
          unit: u
        });
      } else {
        // 이미지 미로드 시 폴백
        ctx.fillStyle = dead ? "#888" : u.color;
        ctx.fillRect(u.x, u.y, u.w, u.h);
      }

      if (!dead) {
        // HP바 배경
        ctx.fillStyle = "#333";
        ctx.fillRect(u.x, u.y - 10, u.w, 6);
        // HP바
        let hp_ratio = u.hp / u.max_hp;
        ctx.fillStyle = hp_ratio > 0.5 ? "#2ecc71" : hp_ratio > 0.25 ? "#f5a623" : "#e74c3c";
        ctx.fillRect(u.x, u.y - 10, u.w * hp_ratio, 6);
      }

      // 이름
      ctx.fillStyle = "#fff";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(u.name, u.x + u.w / 2, u.y - 11);

      ctx.restore();
    });

    this_obj.missile_ctrl.render(ctx);

    ctx.restore();
  }
}
export default UnitControl;
