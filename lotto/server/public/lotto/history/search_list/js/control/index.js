import LottoDataFunc from "/lotto/common/js/func/data_func/index.js";

class ControlMain{
  main=null;
  constructor(main){
    this.main=main;
  }
  async get_last_lotto_by_ajax(){
    let lotto_list=await LottoDataFunc.get_lotto_list_by_local();
    
    if(lotto_list.length>0){
      this.main.data.data.lotto_info_arr=lotto_list;
    }
  };
}
export default ControlMain;