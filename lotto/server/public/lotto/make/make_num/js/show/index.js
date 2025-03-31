import ShowInclude from "./include_num/index.js";
import ShowExcept from "./except_num/index.js";

class ShowMain
{
  static show(inData){
    let opt_obj={
      main:{},
      ...inData
    };

    ShowInclude.show(opt_obj);
    ShowExcept.show(opt_obj);
  }
}
export default ShowMain;