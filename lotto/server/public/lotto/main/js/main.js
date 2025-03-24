import InitData from "./init_data/index.js";
import ControlMain from "./control/index.js";
import ShowMain from "./show/index.js";

class Main{
  data={};
  control=null;
  async init(){
    let this_obj=this;
    this.data=InitData.getInitData();
    this.control=new ControlMain(this);
    await this.control.get_last_lotto_by_ajax();
    this.show({
      main:this_obj,
    });
  }
  show(inData){
    ShowMain.show(inData);
  }
}
export default Main;