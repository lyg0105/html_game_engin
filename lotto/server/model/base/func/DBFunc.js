//var DBFunc=require(global.LottoConstant.ABS+'model/base/func/DBFunc');
var StrFunc=require(global.LottoConstant.ABS+'lib/lyg/string_func');
class DBFunc
{
  static async getMainCompInfo(inOptObj){
    if(inOptObj==undefined){inOptObj={};}
    var optObj={
      "comp_id":"",
      "baseModel":null
    };
    for(var key in inOptObj){
      optObj[key]=inOptObj[key];
    }
    if(optObj["comp_id"]==""||optObj["baseModel"]==null){
      return null;
    }
    optObj["comp_id"]=StrFunc.checkInputStr(optObj["comp_id"]);
    
    var search_opt={
      "t":"main_company",
      "w":["AND comp_id='"+optObj["comp_id"]+"'"],
      "o":"1"
    };
    var mcomp_info=await optObj["baseModel"].db.list(search_opt);
    return mcomp_info;
  }
  static async getMainCompInfoByDbName(inOptObj){
    if(inOptObj==undefined){inOptObj={};}
    var optObj={
      "db_name":"",
      "baseModel":null
    };
    for(var key in inOptObj){
      optObj[key]=inOptObj[key];
    }
    if(optObj["db_name"]==""||optObj["baseModel"]==null){
      return null;
    }
    optObj["db_name"]=StrFunc.checkInputStr(optObj["db_name"]);
    
    var search_opt={
      "t":"main_company",
      "w":["AND comp_db_name='"+optObj["db_name"]+"'"],
      "o":"1"
    };
    var mcomp_info=await optObj["baseModel"].db.list(search_opt);
    return mcomp_info;
  }
  static async getMainCompInfoBySeq(inData){
    var optObj={
      "seq":"",
      "baseModel":null,
      ...inData
    };
    if(optObj["seq"]==""||optObj["seq"]==null){
      return null;
    }
    optObj["seq"]=StrFunc.checkInputStr(optObj["seq"]);
    
    var search_opt={
      "t":"main_company",
      "w":["AND comp_seq='"+optObj["seq"]+"'"],
      "o":"1"
    };
    var mcomp_info=await optObj["baseModel"].db.list(search_opt);
    return mcomp_info;
  }
  static async gePrimaryValueArr(inOptObj){
    if(inOptObj==undefined){inOptObj={};}
    var optObj={
      "data_arr":[],
      "pri_col_arr":[],
    };
    for(var key in inOptObj){
      optObj[key]=inOptObj[key];
    }
    let priValArr=[];
    if(optObj["data_arr"].length==0){return priValArr;}
    if(optObj["pri_col_arr"].length==0){return priValArr;}
    for(var i=0;i<optObj["data_arr"].length;i++){
      var rowData=optObj["data_arr"][i];
      var rowPriValArr=[];
      for(let pri_i=0;pri_i<optObj["pri_col_arr"].length;pri_i++){
        let pri_key=optObj["pri_col_arr"][pri_i];
        if(rowData[pri_key]){
          rowPriValArr.push(rowData[pri_key]);
        }
      }
      if(rowPriValArr.length==optObj["pri_col_arr"].length){
        priValArr.push(rowPriValArr.join(","));
      }
    }
    return priValArr;
  }
  static async getAutoIncrementNum(optObj){
    var baseModel=optObj["baseModel"];
    var table=optObj["table"];
    var auto_key=optObj["auto_key"];
    var pri_col_val=optObj["pri_col_val"];
    var pri_pre_fix="";
    if(optObj["pri_pre_fix"]!=undefined){pri_pre_fix=optObj["pri_pre_fix"];}

    var auto_num=1;
    var tmp_w_arr=[];
    for(var key in pri_col_val){
      pri_col_val[key]=StrFunc.checkInputStr(pri_col_val[key]);
      tmp_w_arr.push("AND "+key+"='"+pri_col_val[key]+"'");
    }
    if(pri_pre_fix!=""){
      tmp_w_arr.push("AND "+auto_key+" LIKE '"+pri_pre_fix+"%'");
    }
    var order_col_str="CAST(regexp_replace("+auto_key+",'[^0-9]','') AS INT)";
    tmp_w_arr.push("ORDER BY "+order_col_str+" DESC LIMIT 1");
    var sql_opt={
      "t":table,
      "w":tmp_w_arr,
      "g":auto_key,
      "o":"1"
    };
    var info=await baseModel.db.list(sql_opt);
    if(info==null||info.length==0){
      return auto_num;
    }else{
      var auto_key_val=info[auto_key];
      auto_key_val=auto_key_val+"";
      auto_key_val=auto_key_val.replace(/[^0-9.-]/gi,"");
      if(auto_key_val!=""){
        auto_num=parseInt(auto_key_val);
        auto_num++;
      }else{
        auto_num=1;
      }
    }

    return auto_num;
  }
  /*
  var BaseModel= require(LottoConstant.ABS+'model/base/baseModel');
  var DBFunc=require(global.LottoConstant.ABS+'model/base/func/DBFunc');
  //db유무 확인
  let mainBaseModel=new BaseModel({
    'server_num':opt_obj["mcomp_info"]["a_server_num"],
    'db_name':opt_obj["mcomp_info"]["a_db_name"],
  });
  let is_db_exist=await DBFunc.hasDataBase({
    baseModel:mainBaseModel,
    db_name:opt_obj["mcomp_info"]["a_db_name"]
  });
  if(is_db_exist==false){
    return Response.get({"result": "false","msg":"DB정보 없음."});
  }
  */
  static async hasDataBase(opt_obj)
  {
    let baseModel=opt_obj['baseModel'];
    let db_name=opt_obj['db_name'];

    //테이블 정보 얻기
    let tmp_w=["AND SCHEMA_NAME='"+db_name+"' LIMIT 1"];
    let sql_opt={
      "t":"INFORMATION_SCHEMA.SCHEMATA",
      "w":tmp_w,
    };
    let info_arr=await baseModel.db.list(sql_opt);
    
    let is_exist=false;
    if(info_arr.length!=0){
        is_exist=true;
    }
    return is_exist;
  }
  static async getCreateSqlOfTable(optObj){
    var baseModel=optObj["baseModel"];
    var from_table_name=optObj["from_table_name"];
    var table_name=optObj["table_name"];
    var db_name=baseModel.db.conn_info.database;

    var tmp_w_arr=["AND TABLE_SCHEMA='"+db_name+"' AND TABLE_NAME='"+from_table_name+"' LIMIT 1"];
    var sql_opt={
      "t":"information_schema.tables",
      "w":tmp_w_arr,
      "o":"1"
    };
    var info=await baseModel.db.list(sql_opt);
    if(info==null||info.length==0){
      return "";
    }
    var sql_str="";
    var get_table_sql="SHOW CREATE TABLE `"+db_name+"`.`"+from_table_name+"`";
    var tb_resultset=await baseModel.db.excute(get_table_sql);
    var info=tb_resultset.results["0"];
    sql_str=info["Create Table"];
    sql_str=sql_str.replace("`"+from_table_name+"`","`"+table_name+"`");

    return sql_str;
  }
  static async hasTable(optObj){
    var baseModel=optObj["baseModel"];
    var table_name=optObj["table_name"];
    var db_name=baseModel.db.conn_info.database;
    var tmp_w=["AND TABLE_SCHEMA='"+db_name+"' AND TABLE_NAME='"+table_name+"' LIMIT 1"];
    var sql_opt={
      "t":"information_schema.tables",
      "w":[tmp_w],
      "o":"1"
    };
    var info=await baseModel.db.list(sql_opt);
    var has_table=true;
    if(info==null||info.length==0){
      has_table=false;
    }
    return has_table;
  }
  static async getXColumnArrByTableName(in_opt_obj){
    var opt_obj={
      "table":"",
      "baseModel":null
    };
    for(var key in in_opt_obj){
      opt_obj[key]=in_opt_obj[key];
    }
    var table=opt_obj["table"];
    var baseModel=opt_obj["baseModel"];
    var db_name=baseModel.db.conn_info.database;
    var x_column_arr={};
    var tmp_where=["AND TABLE_NAME='"+table+"'"];
    tmp_where.push("AND TABLE_SCHEMA='"+db_name+"'");
    tmp_where.push(" ORDER BY ORDINAL_POSITION");
    var get_col="COLUMN_NAME,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH,COLUMN_KEY,EXTRA,COLUMN_COMMENT";
    var sql_opt={
      "t":"INFORMATION_SCHEMA.columns",
      "w":tmp_where,
      "g":get_col
    };
    var col_name_arr=await baseModel.db.list(sql_opt);
    var col_arr_len=col_name_arr.length;
    for(var i=0;i<col_arr_len;i++){
      var col_info=col_name_arr[i];
      var key=col_info["COLUMN_NAME"];
      var max_length=0;
      if(col_info["CHARACTER_MAXIMUM_LENGTH"]!=null){
        max_length=col_info["CHARACTER_MAXIMUM_LENGTH"];
      }
      var tmp_col_arr={
        "name":col_info["COLUMN_COMMENT"],
        'type':col_info["DATA_TYPE"].toLowerCase(),
        "length":max_length,
        "pri":col_info["COLUMN_KEY"],
        "width":"100",
        "auto":""
      };
      if(tmp_col_arr["name"]==""){
        tmp_col_arr["name"]=key;
      }
      if(col_info["EXTRA"].toLowerCase()=="auto_increment"){
        tmp_col_arr["auto"]="1";
      }
      x_column_arr[key]=tmp_col_arr;
    }

    return x_column_arr;
  }
  static getDetailByXColumnArr(x_column_arr){
    var pri_col_arr=[];
    var last_pri_col="";
    var is_date_col_arr=[];
    var is_number_col_arr=[];
    var is_time_col_arr=[];
    for(var key in x_column_arr){
      var val=x_column_arr[key];
      if(val["pri"]=="PRI"){
        pri_col_arr.push(key);
      }
      if(val["type"]!=""){
        val["type"]=val["type"].split("(")[0];
      }
      if(StrFunc.str_in_array(val["type"],["date","datetime"])!=-1){
        is_date_col_arr.push(key);
      }else if(StrFunc.str_in_array(val["type"],["double","float","int","decimal","bigint"])!=-1){
        is_number_col_arr.push(key);
      }else if(StrFunc.str_in_array(val["type"],["time"])!=-1){
        is_time_col_arr.push(key);
      }
    }
    if(pri_col_arr.length>0){
      last_pri_col=pri_col_arr[pri_col_arr.length-1];
    }
    var result_data={
      "pri_col_arr":pri_col_arr,
      "last_pri_col":last_pri_col,
      "is_date_col_arr":is_date_col_arr,
      "is_number_col_arr":is_number_col_arr,
      "is_time_col_arr":is_time_col_arr
    };
    return result_data;
  }
  static printXColumnArr(x_column_arr){
    var column_arr=[];
    for(var key in x_column_arr){
      column_arr.push("\""+key+"\":"+JSON.stringify(x_column_arr[key]));
    }
    return column_arr.join(",<br />");
  }
}
module.exports=DBFunc;