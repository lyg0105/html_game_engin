import ButtonBase from "../../../ui/button/base.js";

class ButtonManageProcess {
  game_data = {};
  down_btn = null;
  up_btn = null;
  click_btn = null;

  constructor(inData) {
    let opt_obj = {
      game_data: {},
      ...inData
    };
    this.game_data = opt_obj.game_data;
    this.init();
  }
  init() {
    let this_obj = this;
    //버튼생성
    let map_move_toggle_btn=new ButtonBase({
      data: {
        idx: this.game_data.buttons.length,
        x: 150,
        y: 2,
        text: 'MapMove',
      }
    });
    map_move_toggle_btn.on_click_custom=()=>{
      map_move_toggle_btn.is_active=!map_move_toggle_btn.is_active;
      this_obj.game_data.control.control_json.map_move_toggle=map_move_toggle_btn.is_active;
    };
    this.game_data.buttons.push(map_move_toggle_btn);
    //채팅버튼 생성
    let chat_toggle_btn=new ButtonBase({
      data: {
        idx: this.game_data.buttons.length,
        x: 250,
        y: 2,
        text: 'Chat',
      }
    });
    chat_toggle_btn.on_click_custom=()=>{
      chat_toggle_btn.is_active=!chat_toggle_btn.is_active;
      this_obj.game_data.control.control_json.chat_toggle=chat_toggle_btn.is_active;
    };
    this.game_data.buttons.push(chat_toggle_btn);
  };

  on_down() {
    let this_obj = this;
    this.down_btn = null;
    let click_point = { x: this_obj.game_data.event.data.mouse_x, y: this_obj.game_data.event.data.mouse_y };
    this_obj.game_data.buttons.forEach((btn) => {
      if (btn.data.is_display&&this.down_btn == null) {
        let btn_rect = {
          x: btn.data.x,
          y: btn.data.y,
          width: btn.data.width,
          height: btn.data.height,
        };
        if (this_obj.game_data.func.collisionFunc.check_rect_point(btn_rect,click_point)) {
          this_obj.down_btn = btn;
        }
      }
    });
  };
  on_up() {
    let this_obj = this;
    this.up_btn = null;
    let click_point = { x: this_obj.game_data.event.data.mouse_x, y: this_obj.game_data.event.data.mouse_y };
    this_obj.game_data.buttons.forEach((btn) => {
      if (btn.data.is_display&&this.up_btn == null) {
        let btn_rect = {
          x: btn.data.x,
          y: btn.data.y,
          width: btn.data.width,
          height: btn.data.height,
        };
        if (this_obj.game_data.func.collisionFunc.check_rect_point(btn_rect,click_point)) {
          this_obj.up_btn = btn;
        }
      }
    });
    if(this_obj.down_btn!=null&&this_obj.up_btn!=null){
      if(this_obj.down_btn.data.idx==this_obj.up_btn.data.idx){
        this_obj.click_btn=this_obj.up_btn;
        this_obj.click_btn.on_click();
      }
    }
  };
};
export default ButtonManageProcess;