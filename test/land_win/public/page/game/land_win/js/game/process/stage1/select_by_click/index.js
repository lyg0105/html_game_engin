class SelectByClick
{
  game_data={};
  down_cell={
    x:0,
    y:0,
    xy:"",
  };
  up_cell={
    x:0,
    y:0,
    xy:"",
  };
  select_cell={
    x:0,
    y:0,
    xy:"",
  };
  
  constructor(inData) {
    let opt_obj={
      game_data:{},
      ...inData
    };
    this.game_data=opt_obj.game_data;
    this.init();
  }
  init(){

  };
  mouse_down(){
    let this_obj=this;
    this_obj.down_cell=this_obj.game_data.func.cellFunc.get_cell_xy_by_click({
      click_x:this_obj.game_data.event.data.mouse_x,
      click_y:this_obj.game_data.event.data.mouse_y,
      game_data:this_obj.game_data,
    });
  };
  mouse_up(){
    let this_obj=this;
    this_obj.up_cell=this_obj.game_data.func.cellFunc.get_cell_xy_by_click({
      click_x:this_obj.game_data.event.data.mouse_up_x,
      click_y:this_obj.game_data.event.data.mouse_up_y,
      game_data:this_obj.game_data,
    });
    //다운,업 같으면 클릭된셀
    if(this_obj.down_cell.xy==this_obj.up_cell.xy){
      //이미있다면 제거
      let tmp_is_exist=false;
      if(this_obj.game_data.func.stringFunc.str_in_array(this_obj.down_cell.xy,this_obj.game_data.selected_cells)!=-1){
        tmp_is_exist=true;
      }
      if(tmp_is_exist){
        this_obj.game_data.selected_cells=[];
      }else{
        this_obj.select_cell=this_obj.down_cell;
        this_obj.game_data.selected_cells=[this_obj.select_cell.xy];
      }
    }
  };
}
export default SelectByClick;