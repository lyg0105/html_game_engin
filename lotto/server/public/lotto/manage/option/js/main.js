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
    this.show=ShowMain;
    
    this.show.show({
      main:this_obj,
    });
  }
}
export default Main;