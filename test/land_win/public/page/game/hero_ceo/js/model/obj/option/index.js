import Buttons from "./buttons/index.js";
import OptionArr from "./option_arr/index.js";
import ObjEvent from "./event/index.js";

class Option {
  main;
  buttons;
  optionArr;

  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    this_obj.optionArr = new OptionArr(main);
    this_obj.optionArr.init_y=100;
    this_obj.optionArr.init();
    this_obj.buttons=new Buttons(main);
    this_obj.buttons.init_btn_y=this_obj.optionArr.init_y+50;
    this_obj.buttons.init();
    new ObjEvent(main);
  }
  render() {
    let this_obj = this;
    let main = this.main;

    this_obj.optionArr.render();

    this_obj.buttons.data.buttons.forEach(function (button) {
      button.render(main.model.data.html.ctx);
    });
  }
}
export default Option;