import AddGoldLayout from "./add_layout/gold/index.js";
import AddFarmLayout from "./add_layout/farm/index.js";

class HTMLObjs {
  layout = {
    game_content_wrap: null,
    gold_table: null,
    farm_btn_wrap: null,
  }
  gold={
    gold_span: null,
    add_gold_span: null,
  };
  farm={
    farm_btn: null,
    farm_per_span: null,
    farm_box_wrap: null,
    farm_box: null,
  };
  constructor() {
    this.init();
  }
  init() {
    
  }
  init_html(){
    this.layout.game_content_wrap = document.getElementById('game_content_wrap');
    AddGoldLayout.action({this_obj:this});
    AddFarmLayout.action({this_obj:this});
  }
}
export default HTMLObjs;