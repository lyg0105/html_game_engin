class ControlArea {
  main;
  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
  }
  stop() {
    let this_obj = this;
    let main = this.main;
    let game = main.model.data.page_obj;

    if (game._loop_interval) {
      clearInterval(game._loop_interval);
      game._loop_interval = null;
    }
    game.data.is_game_loop = false;
  }
  update() {
    let this_obj = this;
    let main = this.main;
    let game = main.model.data.page_obj;

    game.data.elapsed += game.data.loop_frame / 1000;
    let stage = main.model.data.game_data.select_stage;
    let end_sec = stage ? stage.end_sec : 60;
    game.data.timer = Math.max(0, end_sec - game.data.elapsed);

    // 게임 종료 조건 체크
    let all_player_dead = game.unit_control.player_arr.every(u => u.hp <= 0);
    let all_monster_dead = game.unit_control.monster_arr.every(u => u.hp <= 0);

    if (all_monster_dead) {
      game.data.game_result = "win";
      // 처치한 몬스터 골드 합산
      let earned = game.unit_control.monster_arr.reduce(function(sum, m) {
        return sum + (m.gold || 0);
      }, 0);
      game.data.earned_gold = earned;
      main.model.data.game_data.gold += earned;
      main.control.save.save();
      game.control_area.stop();
    } else if (all_player_dead) {
      game.data.game_result = "lose";
      game.control_area.stop();
    } else if (game.data.timer <= 0) {
      game.data.game_result = "time";
      game.control_area.stop();
    }
  }
}
export default ControlArea;
