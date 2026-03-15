import BasicButton from "./common/button/basic/index.js";
import CharListData from "./common/char/data/char_list/index.js";
import StageListData from "./common/char/data/stage_list/index.js";

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
  } 
}
export default Obj;