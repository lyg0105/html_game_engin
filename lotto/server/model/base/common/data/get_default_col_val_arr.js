//var GetDefaultColValArr=require(global.LottoConstant.ABS+'model/base/common/data/get_default_col_val_arr');
var Response=require(global.LottoConstant.ABS+'lib/response/response');
var DateFunc=require(global.LottoConstant.ABS+'lib/lyg/date_func');
var StrFunc=require(global.LottoConstant.ABS+'lib/lyg/string_func');

class GetDefaultColValArr
{
  /*
  optObj={};
  col_val_arr
  x_column_arr
  is_number_col_arr
  is_date_col_arr
  is_time_col_arr
  pri_col_arr
  */
  //GetDefaultColValArr.action(optObj);
  static action(optObj){
    var result_col_val_arr={};

    var ymdStr=DateFunc.get_date_format(new Date(),"Y-m-d");
    var ymdHisStr=DateFunc.get_date_format(new Date(),"Y-m-d h:i:s");
    var hisStr=DateFunc.get_date_format(new Date(),"h:i:s");
    for(var keyStr in optObj["col_val_arr"]){
      var valStr=optObj["col_val_arr"][keyStr];
      if(StrFunc.is_empty(valStr)){valStr="";}
      if(typeof valStr!=="string"){
        valStr=valStr+"";
      }
      if(optObj["x_column_arr"][keyStr]==undefined){
        continue;
      }
      var x_column=optObj["x_column_arr"][keyStr];
      if(x_column["length"]!=""&&x_column["length"]!="0"){
        var length_int=parseInt(x_column["length"]);
        if(valStr.length>=length_int){
          valStr=valStr.substr(0,length_int);
        }
      }

      if(keyStr.indexOf("create_seq")!=-1||keyStr.indexOf("update_seq")!=-1){
        if(!StrFunc.is_empty(valStr)){
          valStr=StrFunc.uncomma(valStr);
          if(valStr==""){valStr="0";}
          if(keyStr.indexOf("create_seq")!=-1){
            result_col_val_arr[keyStr]=valStr;
            continue;
          }
        }else{
          valStr=StrFunc.uncomma(valStr);
          if(valStr==""){valStr="0";}
        }
        if(optObj["login_info"]!=null&&optObj["login_info"]!=undefined&&optObj["login_info"]["user_info"]!=undefined){
          if(!StrFunc.is_empty(optObj["login_info"]["user_info"]["a_seq"])){
            valStr=optObj["login_info"]["user_info"]["a_seq"];
          }
        }
      }else if(StrFunc.str_in_array(keyStr,optObj["is_number_col_arr"])!=-1){
        valStr=StrFunc.getNumber(valStr);
        if(valStr==""){valStr="0";}
      }else if(StrFunc.str_in_array(keyStr,optObj["is_date_col_arr"])!=-1){
        if(valStr==""||valStr.substr(0,10)=="0000-00-00"){
          valStr="0000-00-00";
          if(StrFunc.str_in_array(keyStr,optObj["pri_col_arr"])!=-1){
            valStr=ymdStr;
          }else if(keyStr.indexOf("create_date")!=-1){
            valStr=ymdHisStr;
          }else if(keyStr.indexOf("update_date")!=-1){
            valStr=ymdHisStr;
          }
        }else{
          if(keyStr.indexOf("update_date")!=-1){
            valStr=ymdHisStr;
          }
        }
      }else if(StrFunc.str_in_array(keyStr,optObj["is_time_col_arr"])!=-1){
        if(valStr==""){
          valStr=hisStr;
        }
      }

      result_col_val_arr[keyStr]=valStr;
    }
    for(var key in optObj["x_column_arr"]){
      if(key.indexOf("_update_date")!=-1){
        if(result_col_val_arr[key]==undefined){
          result_col_val_arr[key]=ymdHisStr;
        }
      }else if(key.indexOf("update_seq")!=-1){
        if(result_col_val_arr[key]==undefined){
          if(optObj["login_info"]!=null&&optObj["login_info"]!=undefined&&optObj["login_info"]["user_info"]!=undefined){
            result_col_val_arr[key]=optObj["login_info"]["user_info"]["a_seq"];
          }
        }
      }
    }

    return Response.getResultJson({"data":result_col_val_arr});
  }
}
module.exports=GetDefaultColValArr;