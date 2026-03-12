import UnitControl from "./unit/index.js";
import UIArea from "./ui/index.js";
import EventAera from "./event/index.js";
import ControlArea from "./control/index.js";

class GamePage {
  main;
  _loop_interval = null;
  unit_control = null;
  ui_area=null;
  event_area=null;
  control_area=null;

  data = {
    is_game_loop: false,
    loop_frame: 50,
    buttons: [],
    timer: 0,
    elapsed: 0,
    game_result: null, // null | "win" | "lose" | "time"
  };
  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    let stage = main.model.data.game_data.select_stage;

    this_obj.data.buttons = [];
    this_obj.data.elapsed = 0;
    this_obj.data.timer = stage ? stage.end_sec : 60;
    this_obj.data.game_result = null;

    // 뒤로가기 버튼
    this_obj.ui_area=new UIArea(main);
    this_obj.ui_area.init();

    // 마우스 이벤트
    this_obj.event_area=new EventAera(main);
    this_obj.event_area.init();

    // 유닛 세팅
    this_obj.unit_control = new UnitControl(main);
    this_obj.unit_control.init();

    this_obj.control_area=new ControlArea(main);
    this_obj.control_area.init();

    // 게임 루프 시작
    this_obj.control_area.stop();
    this_obj.data.is_game_loop = true;
    this_obj._loop_interval = setInterval(() => {
      this_obj.update();
      main.view.render();
    }, this_obj.data.loop_frame);
  }
  update() {
    let this_obj = this;
    this_obj.control_area.update();
    this_obj.unit_control.update();
  }
  render() {
    let this_obj = this;
    let main = this.main;
    let ctx = main.model.data.html.ctx;
    let canvas_w = main.model.data.canvas.width;
    let canvas_h = main.model.data.canvas.height;

    // 스테이지 배경
    ctx.save();
    ctx.fillStyle = "#1a3a1a";
    ctx.fillRect(0, 0, canvas_w, canvas_h);
    ctx.restore();

    // 유닛 렌더
    this_obj.unit_control.render();

    //ui
    this_obj.ui_area.render();
  }
}
export default GamePage;
