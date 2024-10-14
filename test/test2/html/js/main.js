import GameData from './data/data.js';
import GameControl from "./control/index.js";
import GameEvent from "./event/index.js";
import GameView from "./view/index.js";
import GameProcess from "./process/index.js";
import LygMath from "./func/math.js";
import LygString from "./func/string.js";

class Main
{
  gameData=null;
  gameControl=null;
  gameEvent=null;
  gameView=null
  gameProcess=null;
  func={
    math:LygMath,
    string:LygString
  };
  constructor(){
    this.init();
  }
  init(){
    this.gameData = new GameData();
    let in_construct_obj={
      main:this
    };
    this.gameView = new GameView(in_construct_obj);
    this.gameEvent = new GameEvent(in_construct_obj);
    this.gameControl = new GameControl(in_construct_obj);
    this.gameProcess = new GameProcess(in_construct_obj);

    this.gameView.init_html();
    this.gameEvent.add_event_to_html();
    this.gameControl.init();
    this.gameControl.start();
  }
}
export default Main;