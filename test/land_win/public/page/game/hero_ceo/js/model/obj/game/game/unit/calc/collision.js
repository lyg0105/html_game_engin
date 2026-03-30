import { get_dist } from "./distance.js";

// 미사일(원)과 유닛(사각형 중심 기준 원)의 충돌 여부
export function is_missile_hit_unit(mx, my, mr, unit) {
  let ux = unit.x + unit.w / 2;
  let uy = unit.y + unit.h / 2;
  return get_dist(mx, my, ux, uy) <= mr + unit.w / 2;
}

// 두 유닛의 접촉 범위(픽셀)
export function get_touch_range(u, target) {
  return (u.w + u.h + target.w + target.h) / 4;
}
