var BaseList=require(global.LottoConstant.ABS+'model/base/common/list/BaseList');
var Response=require(global.LottoConstant.ABS+'lib/response/response');
var StrFunc=require(global.LottoConstant.ABS+'lib/lyg/string_func');

class ListAction extends BaseList
{
  getWhereArr(inOptObj){
    if(inOptObj==undefined){inOptObj={};}
    var optObj={
      "split_table":""
    };
    for(var key in inOptObj){
      optObj[key]=inOptObj[key];
    }
    var where_arr=[];
    if(this.s_list_opt["sc"]!=null){
      for(var key in this.s_list_opt["sc"]){
        var val=this.s_list_opt["sc"][key];
        if(val=="0"){
          val="empty";
        }
        if(val!=""){
          if(this.x_column_arr[key]!=undefined){
            if(val=="empty"){
              where_arr.push(" AND IFNULL("+key+",'') IN ('','0')");
            }else{
              where_arr.push(" AND "+key+" LIKE '%"+val+"%'");
            }
          }
        }
      }
    }
    if(this.s_list_opt["s_pri_arr"]!=null){
      var pri_val_arr_str="'"+this.s_list_opt["s_pri_arr"].join("','")+"'";
      var pri_col_str=this.pri_col_arr.join(",',',");
      where_arr.push("AND CONCAT("+pri_col_str+") IN ("+pri_val_arr_str+")");
    }

    if(this.s_list_opt["s_date_type"]==""){
      this.s_list_opt["s_date_type"]="";//cargo_start_date
    }
    if(this.s_list_opt["s_date_type"]!=""){
      if(this.s_list_opt["s_start_date"]!=""){
        where_arr.push(" AND LEFT("+this.s_list_opt["s_date_type"]+",10) >= '"+this.s_list_opt["s_start_date"]+"'");
      }
      if(this.s_list_opt["s_end_date"]!=""){
        where_arr.push(" AND LEFT("+this.s_list_opt["s_date_type"]+",10) <= '"+this.s_list_opt["s_end_date"]+"'");
      }
    }

    if(!StrFunc.is_empty(this.s_list_opt["s_no1"])){
      where_arr.push("AND drwt_no1='"+this.s_list_opt["s_no1"]+"'");
    }

    return where_arr;
  }
}
module.exports=ListAction;