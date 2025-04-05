import LottoDataFunc from "/lotto/common/js/func/data_func/index.js";
import SelectNumPopup from "./select_num_popup/index.js";

class ControlMain{
  main=null;
  constructor(main){
    this.main=main;
    this.init();
  }
  init(){
    let this_obj=this;
    let open_select_num_include=document.getElementById("open_select_num_include");
    open_select_num_include.onclick=function(){
      this_obj.open_select_num_popup({
        num_sort:"include_num_arr",
      });
    };
    let open_select_num_except=document.getElementById("open_select_num_except");
    open_select_num_except.onclick=function(){
      this_obj.open_select_num_popup({
        num_sort:"except_num_arr",
      });
    };
  }
  async get_last_lotto_by_ajax(){
    let lotto_list=await LottoDataFunc.get_lotto_list_by_local();
    
    if(lotto_list.length>0){
      this.main.data.data.lotto_info_arr=lotto_list;
    }
  };
  open_select_num_popup(inData){
    let opt_obj={
      num_sort:"include_num_arr",//except_num_arr,make_num_arr
      ...inData
    };
    let this_obj=this;
    SelectNumPopup.show({
      main:this_obj.main,
      num_sort:opt_obj.num_sort,
    });
  }
}
export default ControlMain;