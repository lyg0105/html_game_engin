//var GetDetailPriData=require(global.LygLandConstant.ABS+'model/base/common/data/get_detail_pri_data');
var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var DBFunc=require(global.LygLandConstant.ABS+'model/base/func/DBFunc');
var StrFunc=require(global.LygLandConstant.ABS+'lib/lyg/string_func');

class GetDetailPriData
{
  /*
  optObj={};
  baseModel
  table
  table_opt
  table_tail_str
  tmp_is_update
  col_val_arr
  pri_col_arr
  last_pri_col
  x_column_arr
  */
  //GetDefaultColValArr.action(optObj);
  static async action(optObj){
    var pri_col_val_arr={};
    var col_val_arr=optObj["col_val_arr"];
    var pri_data_row=optObj["pri_data_row"];
    var pre_info=optObj["pre_info"];
    var tmp_is_update=optObj["tmp_is_update"];

    var baseModel=optObj["baseModel"];
    var table=optObj["table"];
    var table_tail_str=optObj["table_tail_str"];
    var table_opt=optObj["table_opt"];
    var pri_col_arr=optObj["pri_col_arr"];
    var last_pri_col=optObj["last_pri_col"];
    var x_column_arr=optObj["x_column_arr"];
    var lastPriVal="";
    if(col_val_arr[last_pri_col]!=undefined){
      lastPriVal=col_val_arr[last_pri_col];
    }

    //테이블 있는지 확인
    var hasTbOpt={
      "baseModel":baseModel,
      "table_name":table+table_tail_str
    };
    var has_table=await DBFunc.hasTable(hasTbOpt);
    if(tmp_is_update=="1"&&!has_table){
      //수정인데 테이블 없다면 종료
      return Response.getResultJson({"result":"false","msg":"GetDetailPriData 테이블 없음."});
    }
    //이미있는지 확인
    if(has_table){
      if(lastPriVal!=""&&lastPriVal!="0"){
        var pre_info_w_arr=[];
        for(var i=0;i<pri_col_arr.length;i++){
          var key=pri_col_arr[i];
          var tmp_val=pri_data_row[key];
          tmp_val=StrFunc.checkInputStr(tmp_val);
          pre_info_w_arr.push("AND "+key+"='"+tmp_val+"'");
        }
        var pre_info_sql_opt={
          "t":table+table_tail_str,
          "w":pre_info_w_arr,
          "o":"1"
        };
        var pre_info=await baseModel.db.list(pre_info_sql_opt);
        if(pre_info!=null){
          tmp_is_update="1";
        }
      }
    }

    //등록일때 pri key 만들기
    if(tmp_is_update==""){
      //년별테이블 없으면 생성
      if(!has_table){
        var create_sql=await DBFunc.getCreateSqlOfTable({
          "baseModel":baseModel,
          "from_table_name":table,
          "table_name":table+table_tail_str
        });
        await baseModel.db.excute(create_sql);
      }
      //pri 값 얻기
      for(var key in pri_data_row){
        if(StrFunc.str_in_array(key,pri_col_arr)!=-1){
          pri_col_val_arr[key]=pri_data_row[key];
        }
      }
      //키값 만들기
      if(lastPriVal==""||lastPriVal=="0"){
        var last_xcolumn=x_column_arr[last_pri_col];
        if(last_xcolumn["auto"]=="1"){
          //auto_increment라면 키값 공백놔둔다
        }else{
          var pre_pri_col_val_arr={};
          for(var key in pri_col_val_arr){
            if(key!=last_pri_col){
              pre_pri_col_val_arr[key]=pri_col_val_arr[key];
            }
          }
          var last_num=await DBFunc.getAutoIncrementNum({
            "baseModel":baseModel,
            "table":table+table_tail_str,
            "auto_key":last_pri_col,
            "pri_col_val":pre_pri_col_val_arr,
            "pri_pre_fix":""
          });
          lastPriVal=table_opt["pri_val_prefix"];
          lastPriVal+=last_num;
          col_val_arr[last_pri_col]=lastPriVal;
          pri_data_row[last_pri_col]=lastPriVal;
          pri_col_val_arr[last_pri_col]=lastPriVal;
        }
      }
    }
    if(pre_info!=null&&tmp_is_update=="1"){
      for(var i=0;i<pri_col_arr.length;i++){
        var key=pri_col_arr[i];
        pri_col_val_arr[key]=pre_info[key];
      }
    }

    var result_col_val_arr={
      "pri_col_val_arr":pri_col_val_arr,
      "col_val_arr":col_val_arr,
      "pri_data_row":pri_data_row,
      "pre_info":pre_info,
      "tmp_is_update":tmp_is_update
    };
    return Response.getResultJson({"data":result_col_val_arr});
  }
}
module.exports=GetDetailPriData;