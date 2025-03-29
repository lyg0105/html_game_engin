//import LottoDataFunc from "/lotto/common/js/func/data_func/index.js";
import DateFunc from "/common/js/date/index.js";
import LygFetch from "/common/js/fetch/index.js";
import StringFunc from "/common/js/string/index.js";

class LottoDataFunc {
  static default_lotto_row = {
    drw_no: "",
    drw_no_date: "",
    drwt_no1: "",
    drwt_no2: "",
    drwt_no3: "",
    drwt_no4: "",
    drwt_no5: "",
    drwt_no6: "",
    bnus_no: "",
    first_winamnt: "",
    first_przwner_co: "",
    first_accumamnt: "",
    tot_sellamnt: "",
    return_value: "",
  };
  static ball_color = {
    "1": "#e4a716",
    "10": "#1993da",
    "20": "#e96353",
    "30": "#8f8f8f",
    "40": "#5ab545",
  };
  static async get_lotto_list_by_local(){
    let now_ymdh=DateFunc.get_date_format(new Date(),"Ymdh");
    let lotto_refresh_time=StringFunc.get_local_storage("lotto_refresh_time","");
    let lotto_list=[];
    if(now_ymdh==lotto_refresh_time){
      let lotto_list_str=StringFunc.get_local_storage("lotto_list","[]");
      if(lotto_list_str!=""){
        lotto_list=JSON.parse(lotto_list_str);
      }
    }else{
      lotto_list=await this.get_lotto_list_by_ajax();
      let lotto_list_str=JSON.stringify(lotto_list);
      StringFunc.set_local_storage("lotto_list",lotto_list_str);
      StringFunc.set_local_storage("lotto_refresh_time",now_ymdh);
    }
    return lotto_list;
  }
  static async get_lotto_list_by_ajax(){
    let lotto_list=[];
    let form_json_data={
      "order_id":"drw_no DESC",
      "is_need_count":"",
      "is_need_info_arr":"1",
      "is_no_limit":"1",
    };
    let list_rs=await LygFetch.send({
      url: "/api/lotto/number_list/list",
      data: form_json_data,
    });
    if(list_rs["result"]=="true"){
      if(list_rs["data"]["info_arr"].length>0){
        lotto_list=list_rs["data"]["info_arr"];
      }
    }
    return lotto_list;
  };
}
export default LottoDataFunc;