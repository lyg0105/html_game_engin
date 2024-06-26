import SelectByClick from "./select_by_click/index.js";

class Stage1Process {
  game_data={};
  selectByClick_obj=null;
  constructor(inData) {
    let opt_obj={
      game_data:{},
      ...inData
    };
    this.game_data=opt_obj.game_data;
    this.init();
  }
  init(){
    let this_obj=this;
    this.selectByClick_obj=new SelectByClick({game_data:this.game_data});
    this.game_data.event.on_mouse_down_custom=(e)=>{
      this_obj.selectByClick_obj.mouse_down();
    };
    this.game_data.event.on_mouse_up_custom=(e)=>{
      this_obj.selectByClick_obj.mouse_up();
    };
    this.game_data.event.on_mouse_move_custom=(e)=>{
      
    };
  };
  run() {
    let this_obj=this;
  }
}
export default Stage1Process;