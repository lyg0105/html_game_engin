import InitData from "./init_data/index.js";
import ControlMain from "./control/index.js";
import ShowMain from "./show/index.js";

class Main{
  data={};
  control=null;
  show=null;
  async init(){
    let this_obj=this;
    this.data=InitData.getInitData();
    this.control=new ControlMain(this);
    await this.control.get_last_lotto_by_ajax();
    this.show=ShowMain;
    this.show.show({
      main:this_obj,
    });
  }
}
export default Main;