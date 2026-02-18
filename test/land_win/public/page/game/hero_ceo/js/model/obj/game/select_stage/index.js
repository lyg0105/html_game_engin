import Buttons from "./buttons/index.js";
import ObjEvent from "./event/index.js";

class SelectStage {
  main;
  data = {
    buttons: [],
  };
  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    new Buttons(main);
    new ObjEvent(main);
  }
  render() {
    let this_obj = this;
    let main = this.main;

    this_obj.data.buttons.forEach(function (button) {
      button.render(main.model.data.html.ctx);
    });
  }
}
export default SelectStage;