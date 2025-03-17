class DateFunc
{
  //var d_obj=DateFunc.get_date_json(new Date());
  static get_date_json(d_obj){
    if(d_obj==undefined){
      d_obj=Date();
    }
    var rs_json={
      'Y':d_obj.getFullYear(),
      'm':d_obj.getMonth()+1,
      'd':d_obj.getDate(),
      'h':d_obj.getHours(),
      'i':d_obj.getMinutes(),
      's':d_obj.getSeconds(),
      'day':d_obj.getDay(),
      'date_obj':d_obj,
      'last_day':(new Date(d_obj.getFullYear(),d_obj.getMonth()+1,0)).getDate(),
      't':(new Date(d_obj.getFullYear(),d_obj.getMonth()+1,0)).getDate(),
      'first_day_of_week':(new Date(d_obj.getFullYear(),d_obj.getMonth(),1)).getDay(),
      'week_length':5,
    };
    rs_json.week_length=Math.ceil((rs_json.first_day_of_week + rs_json.last_day) / 7);

    return rs_json;
  }
  //var d_obj=DateFunc.get_change_date(new Date(),'year',+1);
  static get_change_date(d_obj,type,num){
    var d_json=this.get_date_json(d_obj);
    if(type=='year'){
      d_obj.setFullYear(d_json.Y+num);
    }else if(type=='month'){
      d_obj.setMonth(d_json.m+num-1);
    }else if(type=='day'){
      d_obj.setDate(d_json.d+num);
    }else if(type=='hour'){
      d_obj.setHours(d_json.h+num);
    }else if(type=='minute'){
      d_obj.setMinutes(d_json.i+num);
    }else if(type=='sec'){
      d_obj.setSeconds(d_json.s+num);
    }
    return d_obj;
  }
  //var formated_date_str=DateFunc.get_date_format(new Date(),"Y-m-d");
  static get_date_format(d_obj,format_str){
    var d_json=this.get_date_json(d_obj);
    var rs_str=this.get_date_format_by_date_json(d_json,format_str);
    return rs_str;
  }
  static get_date_format_by_date_json(d_json,format_str){
    var f_arr=[];
    for(var key in d_json){
      if(key!='day'){
        f_arr.push(key);
      }
    }
    var rs_str='';
    for(var i=0;i<format_str.length;i++){
      var tmp_c=format_str.charAt(i);
      if(this.str_in_array(tmp_c,f_arr)!=-1){
        tmp_c=this.get_digit_str(d_json[tmp_c]);
      }
      rs_str+=tmp_c;
    }
    return rs_str;
  }
  static get_select_days_of_week(){
    return [
      {value:0,text:"일"},
      {value:1,text:"월"},
      {value:2,text:"화"},
      {value:3,text:"수"},
      {value:4,text:"목"},
      {value:5,text:"금"},
      {value:6,text:"토"},
    ];
  };
  //let day_str=DateFunc.get_day_str_by_day_num(0);
  static get_day_str_by_day_num(day_num,in_day_num_arr){
    let day_name_arr=["일","월","화","수","목","금","토"];
    if(in_day_num_arr!=undefined){
      day_name_arr=in_day_num_arr;
    }
    let day_str="";
    if(day_name_arr[day_num]){
      day_str=day_name_arr[day_num];
    }
    return day_str;
  }
  static get_day_str_by_day_num_arr(day_num_arr,join_str){
    if(join_str==undefined){join_str="";}
    let day_str_arr=[];
    for(let i=0;i<day_num_arr.length;i++){
      day_str_arr.push(this.get_day_str_by_day_num(day_num_arr[i]));
    }
    return day_str_arr.join(join_str);
  };
  //let diff_str=DateFunc.get_date_diff_day(new Date(),new Date()); //return 0
  static get_diff_days_of_date(a_date,b_date){
    let diffMSec = b_date.getTime() - a_date.getTime();
    let diffDate=0;
    if(diffMSec){
      diffDate = diffMSec / (24 * 60 * 60 * 1000);
    }
    return diffDate;
  }
  //var digit_str=DateFunc.get_digit_str(1); //return 10
  static get_digit_str(num_str){
    num_str=parseInt(num_str);
    if(num_str<10){
      num_str='0'+num_str;
    }
    num_str=num_str+'';
    return num_str;
  }
  static getDateFormatOfPretty(dateStr){
    var resultStr="";
    var create_date_arr = dateStr.split(" ");
    var date = create_date_arr[0].split("-");
    var date_str=date[1]+'/'+date[2];
    var time_str = create_date_arr[1].slice(0,5);
    var now_date = this.get_date_format(new Date(),"Y-m-d h:i:s");
    var now_year = this.get_date_format(new Date(),"Y");
    var now_day = this.get_date_format(new Date(),"m.d");
    var tmpday=new Date(now_date.replace(/-/g, "/"))-new Date(dateStr.replace(/-/g, "/"));
    var tmpdate=new Date(now_date.replace(/-/g, "/"))-new Date(dateStr.replace(/-/g, "/"));
    //var h = Math.floor((tmpdate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var h = Math.floor((tmpdate / (3600)) / (1000));
    var m = Math.floor((tmpdate % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((tmpdate % (1000 * 60)) / 1000);
    if(date[0]!==now_year){
      resultStr=date[0]+"/"+date_str+" "+time_str;
    }else if(tmpday>172799999){
      resultStr=date_str+" "+time_str;
    }else if(h>23){
      resultStr='어제';
    }else if(h>0&&h<24){
      resultStr=h+'시간전';
      if(m>40){
        resultStr=h+1+'시간전';
      }
    }else if(h==0&&m<60&&m>0){
      resultStr=m+'분전';
    }else if(h==0&&m==0){
      resultStr=s+'초전';
    }
    return resultStr;
  }
  static getTimeFormatOfPretty(dateStr){
    var resultStr="";
    var create_date_arr = dateStr.split(" ");
    var date = create_date_arr[0].split("-");
    var date_str=date[1]+'.'+date[2];
    var time_str = create_date_arr[1].slice(0,5);
    var tmp_time=time_str.slice(0,2);
    if(tmp_time>11){
      resultStr='오후'+time_str;
    }else{
      resultStr='오전'+time_str;
    }
    return resultStr;
  }
  static str_in_array(search_str,str_arr){
    var is_match=-1;
    for(var i=0;i<str_arr.length;i++){
        if(str_arr[i]==search_str){
            is_match=true;
        }
    }
    return is_match;
  }
}
export default DateFunc;