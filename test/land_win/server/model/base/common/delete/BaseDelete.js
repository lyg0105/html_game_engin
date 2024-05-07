//var BaseDelete=require(global.LygLandConstant.ABS+'model/base/common/delete/BaseDelete');
var get_basic_opt_data=require('../data/get_basic_opt_data');
var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var GetDefaultColValArr=require(global.LygLandConstant.ABS+'model/base/common/data/get_default_col_val_arr');
var TableArr=require(global.LygLandConstant.ABS+'value/table/table_arr');
var ConvertPrefixKey=require(global.LygLandConstant.ABS+'model/base/func/convertPrefixKey');
var StrFunc=require(global.LygLandConstant.ABS+'lib/lyg/string_func');

class BaseDelete
{
  async action(inOptObj){
    var tmp_rs=await get_basic_opt_data.action(inOptObj);
    if(tmp_rs["result"]!="true"){
      return Response.getResultJson({"result":"false","msg":"데이터 오류."+tmp_rs["msg"]});
    }
    var optObj=tmp_rs["data"];

    var error_info_arr=[];
    var return_info_arr=[];
    var data_arr_len=optObj["data_arr"].length;
    var attempt_cnt=0;
    var success_cnt=0;
    for(var data_i=0;data_i<data_arr_len;data_i++){
      var col_val_arr=optObj["data_arr"][data_i];
      attempt_cnt++;
      var tmp_is_update=optObj["is_update"];

      //col_val_arr 기본 데이터 검사
      optObj["col_val_arr"]=col_val_arr;
      optObj["tmp_is_update"]=tmp_is_update;
      tmp_rs=GetDefaultColValArr.action(optObj);
      if(tmp_rs["result"]!="true"){
        error_info_arr.push({"row_num":data_i,"msg":tmp_rs["msg"]});
        continue;
      }
      col_val_arr=tmp_rs["data"];
      optObj["col_val_arr"]=col_val_arr;
      //테이블꼬리얻기
      var table_tail_str=TableArr.getTableTailStr(optObj["table_opt"]["table_id"],col_val_arr,optObj["ymd_key"]);
      optObj["table_tail_str"]=table_tail_str;

      //기존데이터 얻기, pri_val 얻기
      optObj["pri_col_val_arr"]={};
      var pre_where_arr=[];
      for(var key in col_val_arr){
        if(StrFunc.str_in_array(key,optObj["pri_col_arr"])!=-1){
          optObj["pri_col_val_arr"][key]=col_val_arr[key];
          col_val_arr[key]=StrFunc.checkInputStr(col_val_arr[key]);
          pre_where_arr.push("AND "+key+"='"+col_val_arr[key]+"'");
        }
      }
      if(pre_where_arr.length==0){
        error_info_arr.push({"row_num":data_i,"msg":"삭제할 검색 정보 없음."});
        continue;
      }
      var pre_sql_opt={
        "t":optObj["table"]+table_tail_str,
        "w":pre_where_arr,
        "o":"1"
      };
      var pre_info=await optObj["baseModel"].db.list(pre_sql_opt);
      optObj["pre_info"]=pre_info;
      if(pre_info==null){
        error_info_arr.push({"row_num":data_i,"msg":"삭제할 데이터 정보 없음."});
        continue;
      }

      //prev_func
      tmp_rs=await this.prev_func(optObj);
      if(tmp_rs["result"]!="true"){
        error_info_arr.push({"row_num":data_i,"msg":"실행전작업오류:"+tmp_rs["msg"]});
        //continue;
        return Response.getResultJson({
          "result":"false",
          "error":error_info_arr,
          "data":[],
          "msg":tmp_rs["msg"]
        });
      }
      
      var row_is_success=false;
      var delete_sql_opt={
        "t":optObj["table"]+table_tail_str,
        "pri_col_val_arr":optObj["pri_col_val_arr"],
        "debug":optObj["debug"]
      };

      row_is_success=await optObj["baseModel"].db.delete(delete_sql_opt);
      if(row_is_success){
        success_cnt++;
      }else{
        error_info_arr.push({"row_num":data_i,"msg":"삭제 중 오류:"+optObj["baseModel"].db.get_error()});
        return Response.getResultJson({
          "result":"false",
          "error":error_info_arr,
          "data":[],
          "msg":"삭제 중 오류:"+optObj["baseModel"].db.get_error()
        });
        //continue;
      }

      if(row_is_success){
        //after_func
        tmp_rs=await this.after_func(optObj);
        if(tmp_rs["result"]!="true"){
          error_info_arr.push({"row_num":data_i,"msg":"실행후작업오류:"+tmp_rs["msg"]});
          //continue;
          return Response.getResultJson({
            "result":"false",
            "error":error_info_arr,
            "data":[],
            "msg":"실행후작업오류:"+tmp_rs["msg"]
          });
        }
      }

      return_info_arr.push(pre_info);
    }
    
    if(optObj["is_return_convert"]=="1"){
      var colPrefix_str=optObj["table_opt"]["col_prefix"];
      if(colPrefix_str!=""){
        return_info_arr=ConvertPrefixKey.getConvertedPrefixInfoArr(return_info_arr,colPrefix_str+"_","a_");
      }
    }
    var result_msg_str=success_cnt+"개 삭제 되었습니다.";
    if(attempt_cnt!=success_cnt){
      var error_cnt=error_info_arr.length;
      result_msg_str=attempt_cnt+"개 중 "+error_cnt+"개 오류.";
      if(error_info_arr.length>0){
        result_msg_str+=error_info_arr[0]["msg"];
      }
    }
    return Response.getResultJson({
      "error":error_info_arr,
      "data":return_info_arr,
      "msg":result_msg_str
    });
  }
  async prev_func(optObj){
    //optObj["table"]
    //optObj["table_tail_str"]
    //optObj["col_val_arr"]
    //optObj["tmp_is_update"]
    //optObj["pre_info"]...
    return Response.getResultJson({"data":{"col_val_arr":optObj["col_val_arr"]}});
  }
  async after_func(optObj){
    return Response.getResultJson({"data":{"col_val_arr":optObj["col_val_arr"]}});
  }
}
module.exports=BaseDelete;