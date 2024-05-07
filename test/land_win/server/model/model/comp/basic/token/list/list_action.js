var BaseList=require(LygLandConstant.ABS+'model/base/common/list/BaseList');
var Response=require(LygLandConstant.ABS+'lib/response/response');
var StrFunc=require(LygLandConstant.ABS+'lib/lyg/string_func');

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

    if(!StrFunc.is_empty(this.s_list_opt["s_token_id"])){
      where_arr.push("AND token_id='"+this.s_list_opt["s_token_id"]+"'");
    }
    if(!StrFunc.is_empty(this.s_list_opt["s_user_seq"])){
      where_arr.push(" AND token_user_seq = '"+this.s_list_opt["s_user_seq"]+"'");
    }
    if(!StrFunc.is_empty(this.s_list_opt["s_except_token"])){
      if(typeof this.s_list_opt["s_except_token"]=="object"){
        var s_tmp_str=this.s_list_opt["s_except_token"].join("','");
        s_tmp_str="'"+s_tmp_str+"'";
        where_arr.push(" AND token_id NOT IN ("+s_tmp_str+")");
      }else{
        where_arr.push("AND token_id!='"+this.s_list_opt["s_except_token"]+"'");
      }
    }
    if(!StrFunc.is_empty(this.s_list_opt["s_ip"])){
      where_arr.push("AND token_ip='"+this.s_list_opt["s_ip"]+"'");
    }
    if(!StrFunc.is_empty(this.s_list_opt["s_server_ip"])){
      where_arr.push("AND token_server_ip='"+this.s_list_opt["s_server_ip"]+"'");
    }
    if(!StrFunc.is_empty(this.s_list_opt["s_agent"])){
      where_arr.push("AND LEFT(token_agent,30)=LEFT('"+this.s_list_opt["s_agent"]+"',30)");
    }

    return where_arr;
  }
}
module.exports=ListAction;