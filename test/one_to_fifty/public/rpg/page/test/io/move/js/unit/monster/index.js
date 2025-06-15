class MonsterControll{
  static controll(inData){
    let opt_obj={
      main:null,
      ...inData
    };
    let main= opt_obj.main;
    if (main.data.is_host == false) {
      return false;
    }
    let unit_json = main.data.unit_json;

    for (let id in unit_json) {
      const unit = unit_json[id];
      if (unit.type == "monster") {
        // 몬스터가 이동 중이 아니면 타겟 위치를 설정
        if (!unit.is_move && !unit.is_attack) {
          if (unit.target_xy.x == 0 && unit.target_xy.y == 0) {
            let target_x = main.MyMath.random(0, main.map.data.w);
            let target_y = main.MyMath.random(0, main.map.data.h);
            unit.target_xy = { x: target_x, y: target_y };
          }
        }

        // 몬스터가 타겟 위치로 이동
        if (unit.target_xy.x != 0 || unit.target_xy.y != 0) {
          let dx = unit.target_xy.x - unit.x;
          let dy = unit.target_xy.y - unit.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 100) {
            // 이동 방향 계산
            let move_x = (dx / distance) * unit.speed;
            let move_y = (dy / distance) * unit.speed;

            // 몬스터 위치 업데이트
            unit.x += move_x;
            unit.y += move_y;

            // 방향 설정
            if (Math.abs(move_x) > Math.abs(move_y)) {
              unit.direction = move_x > 0 ? "right" : "left";
            } else {
              unit.direction = move_y > 0 ? "down" : "up";
            }
          } else {
            // 타겟 위치 도달 시 초기화
            unit.target_xy = { x: 0, y: 0 };
          }

        }
      }
    }
  }
}
export default MonsterControll;