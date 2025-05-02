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
  static get_match_stats_by_match_data_arr(inData){
    let opt_obj={
      match_data_arr:[],
      ...inData
    };
    let match_data_arr=opt_obj.match_data_arr;
    let stats_data={
      top_rank:99,
      top_rank_data:null,
      group_by_rank:{},
    };
    for(let i=0;i<match_data_arr.length;i++){
      let match_data=match_data_arr[i];
      let rank=parseInt(match_data["rank"]+"");
      if(rank<stats_data.top_rank){
        stats_data.top_rank_data=match_data;
        stats_data.top_rank=rank;
      }

      if(stats_data.group_by_rank[rank]==undefined){
        stats_data.group_by_rank[rank]={
          count:0,
          arr:[],
        };
      }
      stats_data.group_by_rank[rank]["count"]++;
      stats_data.group_by_rank[rank]["arr"].push(match_data);
    }
    return stats_data;
  };
  static get_match_data_arr_by_num_arr(inData){
    let opt_obj={
      num_arr:[],
      lotto_info_arr:[],
      ...inData
    };
    let this_obj=this;
    let num_arr=opt_obj.num_arr;
    let lotto_info_arr=opt_obj.lotto_info_arr;
    let match_data_arr=[];
    for(let i=0;i<lotto_info_arr.length;i++){
      let lotto_info=lotto_info_arr[i];
      let match_data=this_obj.get_math_num_arr_by_num_row({
        num_arr:num_arr,
        lotto_info:lotto_info,
      });
      if(match_data["rank"]<=0){
        continue;
      }
      match_data["num_arr"]=num_arr;
      match_data["lotto_idx"]=lotto_info["drw_no"];
      match_data["date"]=lotto_info["drw_no_date"];
      match_data["first_money"]=lotto_info["first_winamnt"];
      match_data_arr.push(match_data);
    }
    //순서정렬
    let match_order_arr=[];
    for(let i=0;i<match_data_arr.length;i++){
      let match_data=match_data_arr[i];
      let lotto_idx_str=StringFunc.str_pad({
        "str": match_data["lotto_idx"],
        "pad_str": "0",
        "pad_length": 5,
        "direction": "left"
      });
      let order_num=parseFloat(match_data["rank"]+"."+lotto_idx_str);
      match_order_arr.push(order_num);
    }
    match_order_arr.sort(function(a,b){
      return a-b;
    });

    let new_match_data_arr=[];
    for(let order_i=0;order_i<match_order_arr.length;order_i++){
      let row_order_num=match_order_arr[order_i];
      for(let i=0;i<match_data_arr.length;i++){
        let match_data=match_data_arr[i];
        let lotto_idx_str=StringFunc.str_pad({
          "str": match_data["lotto_idx"],
          "pad_str": "0",
          "pad_length": 5,
          "direction": "left"
        });
        let order_num=parseFloat(match_data["rank"]+"."+lotto_idx_str);
        if(row_order_num==order_num){
          new_match_data_arr.push(match_data);
        }
      }
    }
    match_data_arr=new_match_data_arr;

    return match_data_arr;
  }
  static get_math_num_arr_by_num_row(inData){
    let opt_obj={
      num_arr:[],
      lotto_info:{},
      ...inData
    };
    let num_arr=opt_obj.num_arr;
    let lotto_info=opt_obj.lotto_info;
    let match_num_arr=[];
    let is_match_bonus=false;
    let rank=0;
    let lotto_num_arr=[
      lotto_info["drwt_no1"],
      lotto_info["drwt_no2"],
      lotto_info["drwt_no3"],
      lotto_info["drwt_no4"],
      lotto_info["drwt_no5"],
      lotto_info["drwt_no6"],
    ];
    let bonus_num=lotto_info["bnus_no"];
    for(let i=0;i<num_arr.length;i++){
      let num=num_arr[i];
      if(StringFunc.str_in_array(num,lotto_num_arr)!=-1){
        match_num_arr.push(num);
      }
      if(num==bonus_num){
        is_match_bonus=true;
      }
    }
    if(match_num_arr.length==6){
      rank=1;
    }
    else if(match_num_arr.length==5 && is_match_bonus==true){
      rank=2;
    }
    else if(match_num_arr.length==5){
      rank=3;
    }
    else if(match_num_arr.length==4){
      rank=4;
    }
    else if(match_num_arr.length==3){
      rank=5;
    }
    else{
      rank=0;
    }
    return {
      lotto_num_arr:lotto_num_arr,
      match_num_arr:match_num_arr,
      bonus_num:bonus_num,
      is_match_bonus:is_match_bonus,
      rank:rank,
    };
  };
}
export default LottoDataFunc;