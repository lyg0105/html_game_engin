class GameLoop
{
  game=null;
  loop_interval=null;
  opt={
    is_run:true,
    loop_term:50,//50
  };
  init(game){
    this.game=game;
    this.start();
  }
  start(){
    let this_obj=this;
    this_obj.opt.is_run=true;
    this.loop_interval=setInterval(()=>{
      this_obj.process();
      this_obj.draw();
    },this.opt.loop_term);
  }
  stop(){
    clearInterval(this.loop_interval);
  }

  process(){
    this.game.map.move(this.game.control.control);

    let unit_len=this.game.unit_arr.length;
    for(let i=0;i<unit_len;i++){
      let unit=this.game.unit_arr[i];
      if(unit.data.is_select){
        unit.move({
          control:this.game.control.control,
          map:this.game.map,
        });
      }
    }
  }
  draw(){
    let this_obj=this;
    this.game.map.draw();
    let unit_len=this.game.unit_arr.length;
    for(let i=0;i<unit_len;i++){
      let unit=this.game.unit_arr[i];
      unit.draw({
        ctx:this_obj.game.ctx,
        map:this_obj.game.map,
      });
    }
  }
}