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
  }
  draw(){
    this.game.map.draw();
  }
}