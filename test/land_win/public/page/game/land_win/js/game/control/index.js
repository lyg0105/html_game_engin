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
    this.game_data.event.on_key_custom_down=(e)=>{
      this_obj.key_down({
        keyCode:e.keyCode,
      });
    };
    this.game_data.event.on_key_custom_up=(e)=>{
      this_obj.key_up({
        keyCode:e.keyCode,
      });
    };
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

  action(){
    ScreenControl.move_screen({
      screen_data:this.game_data.screen,
      map_data:this.game_data.map,
      control_json:this.control_json,
    });
  };
}
export default GameControl;