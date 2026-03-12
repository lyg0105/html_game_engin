import Buttons from "./buttons/index.js";
import ObjEvent from "./event/index.js";
import StageListArea from "./stage_list/index.js";

class SelectStage {
  main;
  data = {
    buttons: [],
  };
  stage_list_area=null;

  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    this_obj.data.buttons=[];
    this_obj.stage_list_area = new StageListArea(main);
    this_obj.stage_list_area.init();
    let tmp_buttons=new Buttons(main);
    tmp_buttons.init_y=this_obj.stage_list_area.end_y+20;
    tmp_buttons.init();
    new ObjEvent(main);
  }
  render() {
    let this_obj = this;
    let main = this.main;

    this_obj.stage_list_area.render();

    let page_obj = main.model.data.page_obj;
    page_obj.data.buttons.forEach(function (button) {
      button.render(main.model.data.html.ctx);
    });
  }
}
export default SelectStage;