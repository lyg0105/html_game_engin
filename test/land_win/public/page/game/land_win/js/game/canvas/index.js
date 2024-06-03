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
    console.log('CanvasMain init');
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
    this.clear();
    this.ctx.fillStyle = '#444444';
    this.ctx.strokeStyle = '#ffffff';
    let min_draw_x=this.game_data.screen.x;
    let min_draw_y=this.game_data.screen.y;
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
        this.ctx.fillRect(start_x, start_y, this.game_data.map.cell_width, this.game_data.map.cell_height);
        this.ctx.strokeRect(start_x, start_y, this.game_data.map.cell_width, this.game_data.map.cell_height);
      }
    }
  }
}
export default CanvasMain;