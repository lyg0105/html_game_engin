//var CrudEtcFunc=require(global.LygLandConstant.ABS+'model/base/func/crud_etc_func');
var StrFunc=require(global.LygLandConstant.ABS+'lib/lyg/string_func');
var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var TableArr=require(global.LygLandConstant.ABS+'value/table/table_arr');
var DBFunc=require(global.LygLandConstant.ABS+'model/base/func/DBFunc');

class CrudEtcFunc
{
  //CrudEtcFunc.write_arr();
  static async write_arr(inOptObj){
    if(inOptObj==undefined){inOptObj={};}
    var optObj={
      "baseModel":null,
      "table_name":"",
      "data_arr":[],
      "ymd_key":"",
    };
    for(var key in inOptObj){
      optObj[key]=inOptObj[key];
    }
    if(optObj["data_arr"].length==0){
      return Response.get({"result":"false","msg":"write_arr 데이터 없음."});
    }
    if(optObj["baseModel"]==null){
      return Response.get({"result":"false","msg":"DB접속정보 없음."});
    }
    if(optObj["table_name"]==""){
      return Response.get({"result":"false","msg":"테이블명 없음."});
    }

    var table_opt=TableArr.get(optObj["table_name"]);
    if(table_opt==null){
      return Response.get({"result":"false","msg":"테이블 옵션 없음."});
    }

    //컬럼얻기
    var col_arr=[];
    for(var key in optObj["data_arr"][0]){
      col_arr.push(key);
    }
    var col_arr_str=col_arr.join(",");
    col_arr_str="("+col_arr_str+")";

    //auto 자동증가
    var auto_data_arr_rs=await this.set_pri_val_auto_num(optObj);
    optObj["data_arr"]=auto_data_arr_rs["data"]["data_arr"];

    //데이터얻기
    var ymd_val_arr_arr={};
    var val_tot_len=optObj["data_arr"].length;
    for(var row_i=0;row_i<val_tot_len;row_i++){
      var row_data=optObj["data_arr"][row_i];
      var val_arr=[];
      for(var key in row_data){
        val_arr.push("'"+row_data[key]+"'");
      }
      var val_arr_str=val_arr.join(",");
      val_arr_str="("+val_arr_str+")";

      var table_tail_str=TableArr.getTableTailStr(table_opt["table"],row_data,optObj["ymd_key"]);
      if(table_tail_str==""){table_tail_str="basic";}
      if(ymd_val_arr_arr[table_tail_str]==undefined){
        ymd_val_arr_arr[table_tail_str]=[];
      }
      ymd_val_arr_arr[table_tail_str].push(val_arr_str);
    }
    //ymd별 등록
    for(var row_ymd in ymd_val_arr_arr){
      //테이블명얻기
      var table_name_str=table_opt["table"];
      if(row_ymd!="basic"){
        table_name_str=table_name_str+row_ymd;
      }
      //테이블 없으면 생성
      var hasTbOpt={
        "baseModel":optObj["baseModel"],
        "table_name":table_name_str,
      };
      var has_table=await DBFunc.hasTable(hasTbOpt);
      if(!has_table){
        var create_sql=await DBFunc.getCreateSqlOfTable({
          "baseModel":optObj["baseModel"],
          "from_table_name":table_opt["table"],
          "table_name":table_name_str
        });
        await optObj["baseModel"].db.excute(create_sql);
      }

      //쿼리만들기
      var val_arr_str=ymd_val_arr_arr[row_ymd].join(",");
      var insert_sql="INSERT INTO "+table_name_str+col_arr_str+" VALUES"+val_arr_str;
      //실행
      var excute_rs=await optObj["baseModel"].db.excute(insert_sql);
      if(excute_rs["error"]){
        console.log(excute_rs["error"]);
        return Response.get({"result":"false","msg":"등록중에러."});
      }
    }

    var data_arr={"data_arr":optObj["data_arr"]};
    return Response.get({"data":data_arr});
  }
  static async set_pri_val_auto_num(inOptObj){
    if(inOptObj==undefined){inOptObj={};}
    var optObj={
      "baseModel":null,
      "table_name":"",
      "data_arr":[]
    };
    for(var key in inOptObj){
      optObj[key]=inOptObj[key];
    }
    if(optObj["data_arr"].length==0){
      return Response.get({"result":"false","msg":"set_pri_val_auto_num 데이터 없음."});
    }
    if(optObj["baseModel"]==null){
      return Response.get({"result":"false","msg":"DB접속정보 없음."});
    }
    if(optObj["table_name"]==""){
      return Response.get({"result":"false","msg":"테이블명 없음."});
    }

    var table_opt=TableArr.get(optObj["table_name"]);
    if(table_opt==null){
      return Response.get({"result":"false","msg":"테이블 옵션 없음."});
    }
    var x_column_arr=await DBFunc.getXColumnArrByTableName({
      "table":optObj["table_name"],
      "baseModel":optObj["baseModel"]
    });
    var x_column_detail=DBFunc.getDetailByXColumnArr(x_column_arr);
    var pri_col_arr=x_column_detail["pri_col_arr"];
    var last_pri_col=x_column_detail["last_pri_col"];

    var val_tot_len=optObj["data_arr"].length;
    var last_pri_val_arr={};
    var tmp_data_arr=[];
    for(var row_i=0;row_i<val_tot_len;row_i++){
      var row_data=optObj["data_arr"][row_i];
       //pri 값 얻기
       var pri_col_val_arr={};
       for(var key in row_data){
        if(StrFunc.str_in_array(key,pri_col_arr)!=-1){
          pri_col_val_arr[key]=row_data[key];
        }
      }
      //마지막키값 없는 pri val arr 얻기
      var pre_pri_col_val_arr={};
      for(var key in pri_col_val_arr){
        if(key!=last_pri_col){
          pre_pri_col_val_arr[key]=pri_col_val_arr[key];
        }
      }
      var pre_pri_ymd="";
      if(pri_col_arr.length>=2){pre_pri_ymd=row_data[pri_col_arr[0]];}
      //마지막 pri 값 없으면
      if(row_data[last_pri_col]==undefined){row_data[last_pri_col]="";}
      if(row_data[last_pri_col]==""||row_data[last_pri_col]=="0"){
        var table_tail_str=TableArr.getTableTailStr(table_opt["table"],row_data,optObj["ymd_key"]);
        var last_pri_key=table_tail_str+"_"+pre_pri_ymd;
        if(table_tail_str==""){
          last_pri_key="basic_"+pre_pri_ymd;
        }
        if(last_pri_val_arr[last_pri_key]==undefined){
          var hasTbOpt={
            "baseModel":optObj["baseModel"],
            "table_name":table_opt["table"]+table_tail_str,
          };
          var has_table=await DBFunc.hasTable(hasTbOpt);
          if(has_table){
            var last_num=await DBFunc.getAutoIncrementNum({
              "baseModel":optObj["baseModel"],
              "table":table_opt["table"]+table_tail_str,
              "auto_key":last_pri_col,
              "pri_col_val":pre_pri_col_val_arr,
              "pri_pre_fix":""
            });
            last_pri_val_arr[last_pri_key]=last_num;
          }else{
            last_pri_val_arr[last_pri_key]=1;
          }
        }else{
          last_pri_val_arr[last_pri_key]++;
        }
        row_data[last_pri_col]=last_pri_val_arr[last_pri_key];
      }
      tmp_data_arr.push(row_data);
    }
    optObj["data_arr"]=tmp_data_arr;

    var result_data_arr={
      "data_arr":optObj["data_arr"]
    };
    return Response.get({"data":result_data_arr});
  }
  static async delete_arr(inOptObj){
    if(inOptObj==undefined){inOptObj={};}
    var optObj={
      "baseModel":null,
      "table_name":"",
      "data_arr":[]
    };
    for(var key in inOptObj){
      optObj[key]=inOptObj[key];
    }
    if(optObj["data_arr"].length==0){
      return Response.get({"result":"false","msg":"데이터 없음."});
    }
    if(optObj["baseModel"]==null){
      return Response.get({"result":"false","msg":"DB접속정보 없음."});
    }
    if(optObj["table_name"]==""){
      return Response.get({"result":"false","msg":"테이블명 없음."});
    }

    var table_opt=TableArr.get(optObj["table_name"]);
    if(table_opt==null){
      return Response.get({"result":"false","msg":"테이블 옵션 없음."});
    }

    var val_tot_len=optObj["data_arr"].length;
    for(var row_i=0;row_i<val_tot_len;row_i++){
      var row_data=optObj["data_arr"][row_i];
      var table_tail_str=TableArr.getTableTailStr(table_opt["table"],row_data,optObj["ymd_key"]);
      var hasTbOpt={
        "baseModel":optObj["baseModel"],
        "table_name":table_opt["table"]+table_tail_str,
      };
      var has_table=await DBFunc.hasTable(hasTbOpt);
      if(has_table){
        var del_is_success=await optObj["baseModel"].db.delete({
          t:table_opt["table"]+table_tail_str,//table
          pri_col_val_arr:row_data,//{}
        });
        if(!del_is_success){
          return Response.get({"result":"false","msg":row_i+"번째 삭제 중 오류."});
        }
      }
    }

    return Response.get();
  }
}
module.exports=CrudEtcFunc;