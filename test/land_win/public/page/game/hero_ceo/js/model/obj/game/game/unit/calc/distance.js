export function get_dist(ax, ay, bx, by) {
  return Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
}

export function get_nearest(unit, arr) {
  let best = null;
  let best_dist = Infinity;
  let cx = unit.x + unit.w / 2;
  let cy = unit.y + unit.h / 2;
  arr.forEach(function (other) {
    if (other.hp <= 0) return;
    let ox = other.x + other.w / 2;
    let oy = other.y + other.h / 2;
    let d = get_dist(cx, cy, ox, oy);
    if (d < best_dist) {
      best_dist = d;
      best = other;
    }
  });
  return best;
}
