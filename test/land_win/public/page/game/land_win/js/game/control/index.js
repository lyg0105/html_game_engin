import ScreenControl from "./screen/index.js";

class GameControl{
  game_data={};
  key_code_json={
    up:38,
    down:40,
    left:37,
    right:39,
    map_up:87,
    map_down:83,
    map_left:65,
    map_right:68,
  };
  control_json={
    up:false,
    down:false,
    left:false,
    right:false,
    map_up:false,
    map_down:false,
    map_left:false,
    map_right:false,
    map_move_toggle:false,
  };
  map_drag_json={
    pre_x:0,
    pre_x:0,
  };
  constructor(inData){
    let opt_obj={
      game_data:null,
      ...inData
    };
    this.game_data=opt_obj.game_data;
    this.init();
  }
  init(){
    let this_obj=this;
  };
  key_down(inData){
    let opt_obj={
      key_code:"",
      ...inData,
    };
    let key_code=opt_obj.keyCode;
    for(let key in this.key_code_json){
      if(this.key_code_json[key]==key_code){
        this.control_json[key]=true;
      }
    }
  }
  key_up(inData){
    let opt_obj={
      key_code:"",
      ...inData,
    };
    let key_code=opt_obj.keyCode;
    for(let key in this.key_code_json){
      if(this.key_code_json[key]==key_code){
        this.control_json[key]=false;
      }
    }
  }
  mouse_down=()=>{
    let this_obj=this;
    this_obj.map_drag_json.pre_x=this_obj.game_data.event.data.mouse_x;
    this_obj.map_drag_json.pre_y=this_obj.game_data.event.data.mouse_y;
  };
  mouse_move(){
    let this_obj=this;
    //마우스로 맵움직임
    if(this_obj.control_json.map_move_toggle){
      if(this_obj.game_data.event.data.is_mouse_down){
        let change_x=this_obj.map_drag_json.pre_x-this_obj.game_data.event.data.mouse_up_x;
        let change_y=this_obj.map_drag_json.pre_y-this_obj.game_data.event.data.mouse_up_y;
        this_obj.game_data.screen.x+=change_x;
        this_obj.game_data.screen.y+=change_y;
        this_obj.map_drag_json.pre_x=this_obj.game_data.event.data.mouse_up_x;
        this_obj.map_drag_json.pre_y=this_obj.game_data.event.data.mouse_up_y;
      }
    }
  }

  action(){
    ScreenControl.move_screen({
      screen_data:this.game_data.screen,
      map_data:this.game_data.map,
      control_json:this.control_json,
    });
  };
}
export default GameControl;