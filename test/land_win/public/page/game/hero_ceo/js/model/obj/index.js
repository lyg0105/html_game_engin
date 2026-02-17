import BasicButton from "./common/button/basic/index.js";
import Lobby from "./lobby/index.js";

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
    main.model.data.object.lobby = new Lobby(main);
  } 
}
export default Obj;