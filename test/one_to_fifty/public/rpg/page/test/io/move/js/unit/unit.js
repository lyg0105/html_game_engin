import ControllUnit from "./controll/index.js";
import DrawUnit from "./draw_unit/index.js";
import MonsterControll from "./monster/index.js";

class Unit {
  main = null;
  default_unit = {
    type: "player",
    id: 0,
    name: "Player",
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    speed: 5,
    degree: 0,
    direction: "down",
    state_frame:0,
    state_frame_max:800,
    health: 100,
    max_health: 100,
    attack: 10,
    defense: 5,
    is_move: false,
    is_attack: false,
    target_xy:{x:0,y:0},
    connect_time_out:0,
  };
  constructor(main) {
    this.main = main;
    this.init();
  }
  init() {
    let this_obj = this;
  }
  controll() {
    let this_obj = this;
    ControllUnit.check_player_connect({main: this_obj.main});
    ControllUnit.controll_by_event({main: this_obj.main});
    ControllUnit.move_unit({main: this_obj.main});
    ControllUnit.attact_unit({main: this_obj.main});
    ControllUnit.send_select_unit_to_server({main: this_obj.main});
    
    MonsterControll.controll({main: this_obj.main});
  }
  update_frame(){
    let this_obj = this;
    for(let key in this_obj.main.data.unit_json){
      let unit = this_obj.main.data.unit_json[key];
      unit.state_frame+=this_obj.main.data.loop_frame;
      if(unit.state_frame > unit.state_frame_max){
        unit.state_frame = 0;
      }
    }
  }
  draw_unit(){
    let this_obj = this;
    DrawUnit.action({main:this_obj.main});
  }
}
export default Unit;