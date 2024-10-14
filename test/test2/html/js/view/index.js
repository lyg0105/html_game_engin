import HTMLObjs from "./html_obj/index.js";
import RenderFarm from "./render/farm/index.js";

class GameView
{
  main=null;
  htmlObjs=null;
  constructor(inData){
    let opt_obj={
      main:null,
      ...inData
    };
    this.main = opt_obj.main;
    this.init();
  }
  init(){
    this.htmlObjs = new HTMLObjs();
  }
  init_html(){
    this.htmlObjs.init_html();
  }
  render(){
    let this_obj = this;
    this_obj.htmlObjs.gold.gold_span.innerHTML = this_obj.main.gameData.data.gold;
    this_obj.htmlObjs.gold.add_gold_span.innerHTML = this_obj.main.gameData.data.last_add_gold;

    RenderFarm.action({main:this_obj.main});
  }
}
export default GameView;