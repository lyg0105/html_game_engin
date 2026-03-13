import BasicButton from "./common/button/basic/index.js";
import CharListData from "./common/char/data/char_list/index.js";
import StageListData from "./common/char/data/stage_list/index.js";
import Lobby from "./lobby/index.js";
import Option from "./option/index.js";
import Shop from "./shop/index.js";
import SelectChar from "./game/select_char/index.js";
import SelectStage from "./game/select_stage/index.js";
import GamePage from "./game/game/index.js";

class Obj{
  main;
  constructor(main){
    this.main = main;
    this.init();
  }
  init(){
    let this_obj = this;
    let main = this.main;
    main.model.data.object.common={};
    main.model.data.object.common.button={};
    main.model.data.object.common.button.basic = BasicButton;
    main.model.data.object.common.char={};
    main.model.data.object.common.char.data={};
    main.model.data.object.common.char.data.char_list= new CharListData();
    main.model.data.object.common.char.data.stage_list= new StageListData();
    main.model.data.object.lobby = new Lobby(main);
    main.model.data.object.option = new Option(main);
    main.model.data.object.shop = new Shop(main);
    main.model.data.object.select_char = new SelectChar(main);
    main.model.data.object.select_stage = new SelectStage(main);
    main.model.data.object.game = new GamePage(main);
  } 
}
export default Obj;