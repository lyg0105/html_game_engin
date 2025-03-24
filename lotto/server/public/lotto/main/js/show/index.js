import LastNumber from "./last_number/index.js";

class ShowMain
{
  static show(inData){
    let opt_obj={
      main:{},
      ...inData
    };
    LastNumber.action(opt_obj);
  }
}
export default ShowMain;