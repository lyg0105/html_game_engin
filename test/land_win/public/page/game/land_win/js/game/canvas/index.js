class CanvasMain
{
  game_data=null;
  game_body=null;
  ctx=null;
  constructor(inData)
  {
    let opt_obj={
      game_data:null,
      game_body:null,
      ...inData
    };
    this.game_data=opt_obj.game_data;
    this.game_body=opt_obj.game_body;
    this.init();
  }
  init()
  {
    this.game_data.canvas.width=this.game_body.offsetWidth;
    this.game_data.canvas.height=this.game_body.offsetHeight;
    this.game_data.screen.width=this.game_data.canvas.width;
    this.game_data.screen.height=this.game_data.canvas.height;
    this.game_data.map.width=this.game_data.canvas.width;
    this.game_data.map.height=this.game_data.canvas.height;
    this.game_data.canvas.obj=document.createElement('canvas');
    this.game_data.canvas.obj.width=this.game_data.canvas.width;
    this.game_data.canvas.obj.height=this.game_data.canvas.height;
    this.game_body.appendChild(this.game_data.canvas.obj);

    this.ctx=this.game_data.canvas.obj.getContext('2d');
    this.clear();
    this.draw();
  }
  clear()
  {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.game_data.canvas.width, this.game_data.canvas.height);
  }
  draw()
  {
    let this_obj=this;
    this.clear();
    this.ctx.fillStyle = '#444444';
    this.ctx.strokeStyle = '#ffffff';
    let min_draw_x=this.game_data.screen.x-this.game_data.map.cell_width;
    let min_draw_y=this.game_data.screen.y-this.game_data.map.cell_height;
    let max_draw_x=this.game_data.screen.x+this.game_data.screen.width;
    let max_draw_y=this.game_data.screen.y+this.game_data.screen.height;

    for(let i=0;i<this.game_data.map.cell_size;i++){
      let start_x=i*this.game_data.map.cell_width;
      if(start_x<min_draw_x){
        continue;
      }
      for(let j=0;j<this.game_data.map.cell_size;j++){
        let start_y=j*this.game_data.map.cell_height;

        if(start_y<min_draw_y){
          continue;
        }
        if(start_x>max_draw_x){
          break;
        }
        if(start_y>max_draw_y){
          break;
        }
        let draw_x=start_x-this.game_data.screen.x;
        let draw_y=start_y-this.game_data.screen.y;
        let draw_xy_str=i+"_"+j;
        let is_selected_cell=false;
        if(this.game_data.func.stringFunc.str_in_array(draw_xy_str,this_obj.game_data.selected_cells)!=-1){
          is_selected_cell=true;
        }

        this.ctx.fillStyle = '#444444';
        this.ctx.strokeStyle = '#ffffff';
        //선택된건지 확인하기.
        if(is_selected_cell){
          this.ctx.fillStyle = '#44aa22';
        }

        this.ctx.fillRect(draw_x, draw_y, this.game_data.map.cell_width, this.game_data.map.cell_height);
        this.ctx.strokeRect(draw_x, draw_y, this.game_data.map.cell_width, this.game_data.map.cell_height);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "12px Arial";
        this.ctx.textAlign ="left";
        this.ctx.fillText(i+","+j, draw_x+5, draw_y+15);
      }
    }

    //드래그 사각형 그리기
    if(this_obj.game_data.control.control_json.map_move_toggle==false){
      this.ctx.strokeStyle = "#2EFE2E";
      let drag_rect=this.game_data.event.data.drag_rect;
      this.ctx.strokeRect(drag_rect.x, drag_rect.y, drag_rect.w, drag_rect.h);
    }

    //버튼 그리기
    this.game_data.buttons.forEach((button)=>{
      button.draw(this.ctx);
    });
  }
}
export default CanvasMain;