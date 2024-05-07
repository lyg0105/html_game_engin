var InOptObj=require(global.LygLandConstant.ABS+'lib/arr/in_opt_obj');
var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var TableArr=require(global.LygLandConstant.ABS+'value/table/table_arr');
var DBFunc=require(global.LygLandConstant.ABS+'model/base/func/DBFunc');
var ConvertPrefixKey=require(global.LygLandConstant.ABS+'model/base/func/convertPrefixKey');
var StrFunc=require(global.LygLandConstant.ABS+'lib/lyg/string_func');

class GetBasicOptData
{
  static async action(inOptObj){
    var optObj={
      "baseModel":null,//DB연결
      "data_arr":[],//입력데이터 [{'name':'홍길동'},{'name':'이름'}]
      "pri_data_arr":[],//프라이머리데이터
      "is_update":"",//수정인지 여부 1, 공백
      "is_default_val":"",//기본입력 사용 여부 1, 공백(등록일때 null 대신 공백이나 0, 날짜형식등 이 들어감)
      "debug":"",//sql 또는 에러를 표시함 console에 표시 1,공백
      "is_transaction":"1",//중간에 에러났을 때 rollback 할 건지 1,공백
      "is_return":"1",//결과데이터 받을건지 여부 1,공백
      "is_return_convert":"1",//컬럼명 prefix a_로 변경해서 읍답 1,공백

      "origin_data_arr":[],//가공전데이터
      "table":"",//테이블
      "table_id":"",//테이블고유 식별자 string
      "table_opt":null,//table옵션 {}
      "login_info":null,//로그인정보 {}

      "x_column_arr":null,//DB의 컬럼정보 종합{'coulumn1':{'name':'컬럼1','type':'varchar'},'coulumn2':{'name':'컬럼2','type':'varchar'}..}
      "pri_col_arr":null,//primary key arr ['board_ymd','board_seq'..]
      "last_pri_col":null,//마지막 프라이머리키 board_seq
      "is_num_col_arr":null,//숫자컬럼 배열 ['board_order_num','board_read_cnt'..]
      "date_col_arr":null,//날짜컬럼 배열['board_create_date','board_update_date'..]
      "is_time_col_arr":null,//시간컬럼 배열 ['',''..]
      "last_pri_column":"",//last_pri_col과 같음
      "is_auto_increment":"",//마지막 프라이머리키가 auto increment 인지 여부(자동증가) 1, 공백
      "ymd_key":"",//split 테이블 얻기 기준 키 getTableTailStr
    };
    optObj=InOptObj.getOptByIn(optObj,inOptObj);
    optObj["table_opt"]=TableArr.get(optObj["table"]);
    if(optObj["table_opt"]==null){
      return Response.getResultJson({"result":"false","msg":"테이블 정보 없음."});
    }
    optObj["table"]=optObj["table_opt"]["table"];
    optObj["table_id"]=optObj["table_opt"]["table_id"];
    var x_column_arr=await DBFunc.getXColumnArrByTableName({"table":optObj["table"],"baseModel":optObj["baseModel"]});
    var x_column_detail=DBFunc.getDetailByXColumnArr(x_column_arr);
    optObj["x_column_arr"]=x_column_arr;
    optObj["pri_col_arr"]=x_column_detail["pri_col_arr"];
    optObj["last_pri_col"]=x_column_detail["last_pri_col"];
    optObj["is_date_col_arr"]=x_column_detail["is_date_col_arr"];
    optObj["is_number_col_arr"]=x_column_detail["is_number_col_arr"];
    optObj["is_time_col_arr"]=x_column_detail["is_time_col_arr"];
    optObj["last_pri_column"]=x_column_arr[x_column_detail["last_pri_col"]];
    if(optObj["last_pri_column"]!=undefined&&optObj["last_pri_column"]["auto"]!=""){
      optObj["is_auto_increment"]="1";
    }

    if(optObj["login_info"]==null||optObj["login_info"]==undefined){
      optObj["login_info"]=optObj["baseModel"]["login_info"];
    }

    if(optObj["table_opt"]["col_prefix"]!=""){
      optObj["data_arr"]=ConvertPrefixKey.getConvertedPrefixInfoArr(optObj["data_arr"],"a_",optObj["table_opt"]["col_prefix"]+"_");
      optObj["pri_data_arr"]=ConvertPrefixKey.getConvertedPrefixInfoArr(optObj["pri_data_arr"],"a_",optObj["table_opt"]["col_prefix"]+"_");
    }
    if(optObj["is_default_val"]=="1"&&optObj["is_update"]==""){
      optObj["data_arr"]=this.getAddDefaultDataArr(optObj["data_arr"],optObj["x_column_arr"],x_column_detail);
    }
    if(optObj["pri_data_arr"].length==0){
      optObj["pri_data_arr"]=optObj["data_arr"];
    }
    optObj["origin_data_arr"]=optObj["data_arr"];

    return Response.getResultJson({"data":optObj});
  }

  static getAddDefaultDataArr(data_arr,x_column_arr,x_column_detail){
    var result_data_arr=[];
    var is_number_col_arr=x_column_detail["is_number_col_arr"];
    var is_date_col_arr=x_column_detail["is_date_col_arr"];
    var data_arr_len=data_arr.length;
    for(var i=0;i<data_arr_len;i++){
      var row_json=data_arr[i];
      for(var key in x_column_arr){
        var default_val="";
        if(StrFunc.str_in_array(key,is_number_col_arr)!=-1){
          default_val="0";
        }else if(StrFunc.str_in_array(key,is_date_col_arr)!=-1){
          default_val="0000-00-00";
        }
        if(row_json[key]==undefined){
          row_json[key]=default_val;
        }
      }
      result_data_arr.push(row_json);
    }
    return result_data_arr;
  }
}
module.exports=GetBasicOptData;
