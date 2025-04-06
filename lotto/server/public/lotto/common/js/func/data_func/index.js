//import LottoDataFunc from "/lotto/common/js/func/data_func/index.js";
import DateFunc from "/common/js/date/index.js";
import LygFetch from "/common/js/fetch/index.js";
import StringFunc from "/common/js/string/index.js";
import MyMath from "/common/js/math/index.js";

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
  static get_color_by_num(num){
    let ball_color=LottoDataFunc.ball_color;
    let num_color="#fff";
    if(num>=40){
      num_color=ball_color["40"];
    }else if(num>=30){
      num_color=ball_color["30"];
    }else if(num>=20){
      num_color=ball_color["20"];
    }else if(num>=10){
      num_color=ball_color["10"];
    }else{
      num_color=ball_color["1"];
    }
    return num_color;
  }
  static get_lotto_num_arr_by_opt(inData){
    let opt_obj={
      start_num:1,
      end_num:45,
      num_count:6,
      except_num_arr:[],
      include_num_arr:[],
      ...inData
    };
    let make_num_arr=[];
    let num_count=opt_obj.num_count;
    let start_num=opt_obj.start_num;
    let end_num=opt_obj.end_num;
    let except_num_arr=opt_obj.except_num_arr;
    let include_num_arr=opt_obj.include_num_arr;
    let num_list=[];

    //포함번호추가
    if(include_num_arr.length>0){
      for(let i=0;i<include_num_arr.length;i++){
        let num=include_num_arr[i];
        if(StringFunc.str_in_array(num,make_num_arr)==-1){
          make_num_arr.push(num);
        }
      }
    }
    num_count=num_count-make_num_arr.length;
    if(num_count<=0){
      return make_num_arr;
    }

    for(let i=start_num;i<=end_num;i++){
      let is_except=false;
      //제외번호체크
      if(except_num_arr.length>0){
        for(let j=0;j<except_num_arr.length;j++){
          let num=except_num_arr[j];
          if(num==i){
            is_except=true;
          }
        }
      }
      //포함번호체크
      if(include_num_arr.length>0){
        for(let j=0;j<include_num_arr.length;j++){
          let num=include_num_arr[j];
          if(num==i){
            is_except=true;
          }
        }
      }

      if(is_except==true){
        continue;
      }

      num_list.push(i);
    }

    //뽑기
    for(let pick_i=0;pick_i<num_count;pick_i++){
      if(num_list.length>0){
        let pick_num_idx=MyMath.random(0,num_list.length-1);
        let pick_num=num_list[pick_num_idx];
        make_num_arr.push(pick_num);
        num_list=StringFunc.remove_idx_in_array(pick_num_idx,num_list);
      }
    }

    return make_num_arr;
  };
}
export default LottoDataFunc;