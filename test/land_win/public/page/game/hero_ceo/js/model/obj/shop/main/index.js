import UIArea from "./ui/index.js";
import ObjEvent from "./event/index.js";

class Shop {
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
    new UIArea(main);
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
export default Shop;