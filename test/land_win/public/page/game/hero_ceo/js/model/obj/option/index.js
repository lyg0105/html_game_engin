import UIArea from "./ui/index.js";
import OptionArr from "./option_arr/index.js";
import ObjEvent from "./event/index.js";

class Option {
  main;
  ui;
  optionArr;

  constructor(main) {
    this.main = main;
    let this_obj = this;
    this_obj.optionArr = new OptionArr(main);
    this_obj.ui=new UIArea(main);
  }
  init() {
    let this_obj = this;
    let main = this.main;
    this_obj.optionArr.init_y=100;
    this_obj.optionArr.init();
    this_obj.ui.init_btn_y=this_obj.optionArr.init_y+50;
    this_obj.ui.init();
    new ObjEvent(main);
  }
  render() {
    let this_obj = this;
    let main = this.main;

    this_obj.optionArr.render();

    this_obj.ui.data.buttons.forEach(function (button) {
      button.render(main.model.data.html.ctx);
    });
  }
}
export default Option;