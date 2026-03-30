import { get_dist } from "./distance.js";
import { is_missile_hit_unit } from "./collision.js";
import { apply_dmg } from "./damage.js";

class MissileControl {
  missile_arr = [];
  explosion_arr = [];

  init() {
    this.missile_arr = [];
    this.explosion_arr = [];
  }

  push(missile) {
    this.missile_arr.push(missile);
  }

  update() {
    let this_obj = this;

    this_obj.missile_arr = this_obj.missile_arr.filter(function (m) {
      let tx = m.target.x + m.target.w / 2;
      let ty = m.target.y + m.target.h / 2;
      let dx = tx - m.x;
      let dy = ty - m.y;
      let dist = get_dist(m.x, m.y, tx, ty);

      // 타겟 방향으로 이동
      if (dist > m.speed) {
        m.x += (dx / dist) * m.speed;
        m.y += (dy / dist) * m.speed;
      } else {
        m.x = tx;
        m.y = ty;
      }

      if (m.attack_type === "explode") {
        // 살아있는 적 중 하나라도 닿으면 폭발
        let hit = m.enemies.some(function (e) {
          if (e.hp <= 0) return false;
          return is_missile_hit_unit(m.x, m.y, m.r, e);
        });
        if (hit) {
          // 폭발 범위 내 모든 적에게 데미지
          m.enemies.forEach(function (e) {
            if (e.hp <= 0) return;
            let ex = e.x + e.w / 2;
            let ey = e.y + e.h / 2;
            if (get_dist(m.x, m.y, ex, ey) <= m.explode_r) {
              if (Math.random() < 0.5) apply_dmg(e, m.dmg);
            }
          });
          this_obj.explosion_arr.push({
            x: m.x, y: m.y,
            r: 0, max_r: m.explode_r,
            color: m.color, tick: 0,
          });
          return false;
        }
      } else {
        // 일반 투사체: 타겟에 닿으면 데미지
        if (m.target.hp <= 0) return false;
        if (dist <= m.speed) {
          apply_dmg(m.target, m.dmg);
          return false;
        }
      }
      return true;
    });

    // 폭발 이펙트 업데이트
    this_obj.explosion_arr = this_obj.explosion_arr.filter(function (e) {
      e.tick++;
      e.r = e.max_r * (e.tick / 12);
      return e.tick < 12;
    });
  }

  render(ctx) {
    // 투사체 렌더링
    this.missile_arr.forEach(function (m) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fillStyle = m.color;
      ctx.shadowColor = m.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    });

    // 폭발 이펙트 렌더링
    this.explosion_arr.forEach(function (e) {
      let alpha = 1 - e.tick / 12;
      ctx.save();
      ctx.globalAlpha = alpha * 0.6;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = e.color;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    });
  }
}

export default MissileControl;
