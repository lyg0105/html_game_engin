class GameProcess
{
  main = null;
  game_loop = null;
  loop_delay = 50;
  constructor(inData){
    let opt_obj={
      main:null,
      ...inData
    };
    this.main = opt_obj.main;
    this.init();
  }
  init(){
    
  }
  start(){
    let this_obj = this;
    if(this.game_loop != null){
      clearInterval(this.game_loop);
    }
    this.game_loop = setInterval(()=>{
      this_obj.loop();
    }, this_obj.loop_delay);
  }
  stop(){
    if(this.game_loop != null){
      clearInterval(this.game_loop);
    }
    this.game_loop = null;
  }
  loop(){
    let this_obj = this;
    this_obj.main.gameControl.farm.auto_run();
    this_obj.main.gameView.render();
  }
}
export default GameProcess;