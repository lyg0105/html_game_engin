//var DateFunc=require(global.LygLandConstant.ABS+'lib/lyg/date_func');
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
      'date_obj':d_obj
    };
    rs_json['last_day']=(new Date(rs_json.Y,rs_json.m,0)).getDate();
    rs_json['t']=rs_json['last_day'];
    rs_json['first_day_of_week']=(new Date(rs_json.Y,rs_json.m-1,1)).getDay();

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
module.exports=DateFunc;