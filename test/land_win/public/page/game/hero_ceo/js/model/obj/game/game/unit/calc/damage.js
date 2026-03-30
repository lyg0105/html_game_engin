export function calc_dmg(attacker, target) {
  return Math.max(1, attacker.attack - target.defense);
}

export function apply_dmg(target, dmg) {
  target.hp = Math.max(0, target.hp - dmg);
}
