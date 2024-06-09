class ScreenControl{
  static move_screen(inData){
    let opt_obj={
      screen_data:null,
      map_data:null,
      control_json:null,
      ...inData,
    };
    let screen_data=opt_obj.screen_data;
    let control_json=opt_obj.control_json;
    if(control_json.map_up){
      screen_data.y-=screen_data.speed;
    }
    if(control_json.map_down){
      screen_data.y+=screen_data.speed;
    }
    if(control_json.map_left){
      screen_data.x-=screen_data.speed;
    }
    if(control_json.map_right){
      screen_data.x+=screen_data.speed;
    }
  };
}
export default ScreenControl;