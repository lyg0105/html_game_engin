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
    let make_num_btn=document.getElementById("make_num_btn");
    make_num_btn.onclick=function(){
      this_obj.make_num();
      this_obj.main.show.show({
        main:this_obj.main,
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
  make_num(){
    let this_obj=this;
    let make_num_arr=LottoDataFunc.get_lotto_num_arr_by_opt({
      except_num_arr:this_obj.main.data.data.except_num_arr,
      include_num_arr:this_obj.main.data.data.include_num_arr,
    });
    make_num_arr.sort(function(a,b){
      return a-b;
    });
    let match_arr=LottoDataFunc.get_match_data_arr_by_num_arr({
      num_arr:make_num_arr,
      lotto_info_arr:this_obj.main.data.data.lotto_info_arr,
    });
    let make_num_match={
      num_arr:make_num_arr,
      match_arr:match_arr,
      top_rank:99,
      top_rank_data:{},
      group_by_rank:{},
      is_show_detail:false,
    };
    let match_stats_data=LottoDataFunc.get_match_stats_by_match_data_arr({
      match_data_arr:match_arr,
    });
    make_num_match={
      ...make_num_match,
      ...match_stats_data,
    };
    this_obj.main.data.data.make_num_match_arr.push(make_num_match);
  };
  remove_make_num(inData){
    let opt_obj={
      index:0,
      ...inData
    };
    this.main.data.data.make_num_match_arr.splice(opt_obj.index,1);
  }
  remove_all_make_num(){
    this.main.data.data.make_num_match_arr=[];
  };
}
export default ControlMain;