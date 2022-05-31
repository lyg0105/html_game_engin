class LygLadderGameEvent
{
  ladder=null;
  constructor(ladder){
    this.ladder=ladder;
  }
  set_event(){
    var this_event=this;
    var this_obj=this.ladder;
    this_obj.opt.canvas_obj.addEventListener("mousemove", function(e){
      this_obj.screen.mouse_x=e.offsetX;
      this_obj.screen.mouse_y=e.offsetY;
      this_event.on_hover_button();
    });
    this_obj.opt.canvas_obj.addEventListener("click", function(e){
      this_obj.screen.mouse_x=e.offsetX;
      this_obj.screen.mouse_y=e.offsetY;
      this_event.on_click_button();
    });
  }
  on_hover_button(){
    let btn_cnt=this.ladder.page_data.button_arr.length;
    var is_in_hover=false;
    for(let btn_i=0;btn_i<btn_cnt;btn_i++){
      let btn=this.ladder.page_data.button_arr[btn_i];
      if(btn.is_enter_mouse(this.ladder.screen.mouse_x,this.ladder.screen.mouse_y)){
        is_in_hover=true;
      }
    }
    if(is_in_hover){
      this.ladder.opt.canvas_obj.style.cursor='pointer';
    }else{
      this.ladder.opt.canvas_obj.style.cursor='';
    }
  }
  on_click_button(){
    let btn_cnt=this.ladder.page_data.button_arr.length;
    for(let btn_i=0;btn_i<btn_cnt;btn_i++){
      let btn=this.ladder.page_data.button_arr[btn_i];
      if(btn&&btn.is_enter_mouse(this.ladder.screen.mouse_x,this.ladder.screen.mouse_y)){
        btn.opt.on_click();
      }
    }
  }
}
export default LygLadderGameEvent;