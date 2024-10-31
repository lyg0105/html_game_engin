//var BaseWrite=require(global.LottoConstant.ABS+'model/base/common/write/BaseWrite');
var get_basic_opt_data=require('../data/get_basic_opt_data');
var Response=require(global.LottoConstant.ABS+'lib/response/response');
var GetDefaultColValArr=require(global.LottoConstant.ABS+'model/base/common/data/get_default_col_val_arr');
var TableArr=require(global.LottoConstant.ABS+'value/table/table_arr');
var GetDetailPriData=require(global.LottoConstant.ABS+'model/base/common/data/get_detail_pri_data');
var ConvertPrefixKey=require(global.LottoConstant.ABS+'model/base/func/convertPrefixKey');
var StrFunc=require(global.LottoConstant.ABS+'lib/lyg/string_func');

class BaseWrite
{
  async action(inOptObj){
    if(inOptObj['is_app']=='1'){
      var tmpInOptObj = JSON.stringify(inOptObj);
      tmpInOptObj = JSON.parse(tmpInOptObj);
      if(!StrFunc.is_empty(inOptObj["data_arr"])){
        inOptObj["data_arr"] =JSON.parse(tmpInOptObj["data_arr"]);
      }
    }
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
    var insert_cnt=0;
    var update_cnt=0;
    for(var data_i=0;data_i<data_arr_len;data_i++){
      var col_val_arr=optObj["data_arr"][data_i];
      var pri_data_row=optObj["pri_data_arr"][data_i];
      attempt_cnt++;
      var tmp_is_update=optObj["is_update"];

      //col_val_arr 기본 데이터 검사
      optObj["idx"]=data_i;
      optObj["col_val_arr"]=col_val_arr;
      optObj["tmp_is_update"]=tmp_is_update;
      tmp_rs=GetDefaultColValArr.action(optObj);
      if(tmp_rs["result"]!="true"){
        error_info_arr.push({"row_num":data_i,"msg":tmp_rs["msg"]});
        return_info_arr.push(col_val_arr);
        continue;
      }
      col_val_arr=tmp_rs["data"];
      optObj["col_val_arr"]=col_val_arr;
      optObj["pri_data_row"]=pri_data_row;
      //테이블꼬리얻기
      var table_tail_str=TableArr.getTableTailStr(optObj["table_opt"]["table_id"],col_val_arr,optObj["ymd_key"]);
      optObj["table_tail_str"]=table_tail_str;
      //기존데이터 얻기, pri_val 얻기
      tmp_rs=await GetDetailPriData.action(optObj);
      if(tmp_rs["result"]!="true"){
        error_info_arr.push({"row_num":data_i,"msg":tmp_rs["msg"]});
        return_info_arr.push(col_val_arr);
        continue;
      }
      optObj["pri_col_val_arr"]=tmp_rs["data"]["pri_col_val_arr"];
      optObj["col_val_arr"]=tmp_rs["data"]["col_val_arr"];
      col_val_arr=tmp_rs["data"]["col_val_arr"];
      optObj["pre_info"]=tmp_rs["data"]["pre_info"];
      var pre_info=tmp_rs["data"]["pre_info"];
      optObj["tmp_is_update"]=tmp_rs["data"]["tmp_is_update"];
      tmp_is_update=tmp_rs["data"]["tmp_is_update"];

      if(tmp_is_update=="1"&&optObj["pre_info"]==null){
        error_info_arr.push({"row_num":data_i,"msg":"수정 할 데이터 정보가 없습니다.:"});
        return_info_arr.push(col_val_arr);
        continue;
      }

      //prev_func
      tmp_rs=await this.prev_func(optObj);
      if(tmp_rs["result"]!="true"){
        error_info_arr.push({"row_num":data_i,"msg":"실행전작업오류:"+tmp_rs["msg"]});
        return_info_arr.push(col_val_arr);
        continue;
      }
      optObj["col_val_arr"]=tmp_rs["data"]["col_val_arr"];
      col_val_arr=tmp_rs["data"]["col_val_arr"];

      var row_is_success=false;
      if(tmp_is_update!="1"){
        var insert_sql_opt={
          "t":optObj["table"]+table_tail_str,
          "col_val_arr":col_val_arr,
          "debug":optObj["debug"]
        };
        row_is_success=await optObj["baseModel"].db.insert(insert_sql_opt);
        if(row_is_success){
          success_cnt++;
          insert_cnt++;
          if(optObj["is_auto_increment"]=="1"){
            col_val_arr[optObj["last_pri_col"]]=optObj["baseModel"].db.last_id;
            optObj["col_val_arr"]=col_val_arr;
            optObj["pri_col_val_arr"][optObj["last_pri_col"]]=optObj["baseModel"].db.last_id;
          }
        }else{
          error_info_arr.push({"row_num":data_i,"msg":"등록 중 오류:"+optObj["baseModel"].db.get_error()});
          return_info_arr.push(col_val_arr);
          continue;
        }
      }else{
        var update_sql_opt={
          "t":optObj["table"]+table_tail_str,
          "col_val_arr":col_val_arr,
          "pri_col_val_arr":optObj["pri_col_val_arr"],
          "debug":optObj["debug"]
        };

        row_is_success=await optObj["baseModel"].db.update(update_sql_opt);
        if(row_is_success){
          success_cnt++;
          update_cnt++;
        }else{
          error_info_arr.push({"row_num":data_i,"msg":"수정 중 오류:"+optObj["baseModel"].db.get_error()});
          return_info_arr.push(col_val_arr);
          continue;
        }
      }

      if(row_is_success){
        //after_func
        tmp_rs=await this.after_func(optObj);
        if(tmp_rs["result"]!="true"){
          error_info_arr.push({"row_num":data_i,"msg":"실행후작업오류:"+tmp_rs["msg"]});
          return_info_arr.push(col_val_arr);
          continue;
        }
      }

      return_info_arr.push(col_val_arr);
    }

    if(optObj["is_return_convert"]=="1"){
      var colPrefix_str=optObj["table_opt"]["col_prefix"];
      if(colPrefix_str!=""){
        return_info_arr=ConvertPrefixKey.getConvertedPrefixInfoArr(return_info_arr,colPrefix_str+"_","a_");
      }
    }
    var rs_result="true";
    var result_msg_str=insert_cnt+"개 등록 "+update_cnt+"개 수정 되었습니다.";
    if(attempt_cnt!=success_cnt){
      rs_result="false";
      var error_cnt=error_info_arr.length;
      result_msg_str=attempt_cnt+"개 중 "+error_cnt+"개 오류.";
      if(error_info_arr.length>0){
        result_msg_str+=error_info_arr[0]["msg"];
      }
    }
    return Response.getResultJson({
      "result":rs_result,
      "error":error_info_arr,
      "data":return_info_arr,
      "msg":result_msg_str
    });
  }

  prev_func(optObj){
    //optObj["table"]
    //optObj["table_tail_str"]
    //optObj["col_val_arr"]
    //optObj["tmp_is_update"]
    //optObj["pre_info"]...
    return Response.getResultJson({"data":{"col_val_arr":optObj["col_val_arr"]}});
  }
  after_func(optObj){
    return Response.getResultJson({"data":{"col_val_arr":optObj["col_val_arr"]}});
  }
}
module.exports=BaseWrite;
