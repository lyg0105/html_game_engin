import Buttons from "./buttons/index.js";
import ObjEvent from "./event/index.js";
import CharList from "./char_list/index.js";

class SelectChar {
  main;
  char_list;
  data = {
    buttons: [],
    char_arr: [],
    char_cards: [],
    select_char_arr: [],
  };
  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    this_obj.data.select_char_arr = [];
    this_obj.char_list=new CharList(main);
    this_obj.char_list.init();
    new Buttons(main);
    new ObjEvent(main);
  }
  render() {
    let this_obj = this;
    let main = this.main;
    
    this_obj.data.buttons.forEach(function (button) {
      button.render(main.model.data.html.ctx);
    });
    this_obj.char_list.render();
  }
}
export default SelectChar;