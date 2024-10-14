class GameEvent
{
  main=null;
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
  add_event_to_html(){
    let control = this.main.gameControl;
    let view = this.main.gameView;
    view.htmlObjs.farm.farm_btn.addEventListener('click',function(){
      control.farm.atuo_toggle();
    });
  };
}
export default GameEvent;