import ShowLottoList from "./lotto_list/index.js";

class ShowMain
{
  static show(inData){
    let opt_obj={
      main:{},
      ...inData
    };
    ShowLottoList.show(opt_obj);
  }
}
export default ShowMain;