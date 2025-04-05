import ShowNumArea from "./show_num_area/index.js";

class ShowMain
{
  static show(inData){
    let opt_obj={
      main:{},
      ...inData
    };

    ShowNumArea.show(opt_obj);
  }
}
export default ShowMain;