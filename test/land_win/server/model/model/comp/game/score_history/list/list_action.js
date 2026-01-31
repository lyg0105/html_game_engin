var BaseList=require(global.LygLandConstant.ABS+'model/base/common/list/BaseList');
var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var StrFunc=require(global.LygLandConstant.ABS+'lib/lyg/string_func');

class ListAction extends BaseList
{
  async getInfoArrAddon(info_arr){
    if(StrFunc.is_empty(this.s_list_opt["is_not_addon_pw"])){
      //암호는 안보이게
      var tmp_info_arr=[];
      for(var i=0;i<info_arr.length;i++){
        var info=info_arr[i];
        delete info["user_user_pw"];
        tmp_info_arr.push(info);
      }
      info_arr=tmp_info_arr;
    }
    return info_arr;
  }
  getWhereArr(inOptObj){
    if(inOptObj==undefined){inOptObj={};}
    var optObj={
      "split_table":""
    };
    for(var key in inOptObj){
      optObj[key]=inOptObj[key];
    }
    var this_obj=this;
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
    if(!StrFunc.is_empty(this.s_list_opt["s_seq"])){
      if(typeof this.s_list_opt["s_seq"]=="object"){
        var s_tmp_str=this.s_list_opt["s_seq"].join("','");
        s_tmp_str="'"+s_tmp_str+"'";
        where_arr.push(" AND CONCAT("+pri_col_str+") IN ("+s_tmp_str+")");
      }else{
        where_arr.push("AND CONCAT("+pri_col_str+")='"+this.s_list_opt["s_seq"]+"'");
      }
    }
    
    if(!StrFunc.is_empty(this.s_list_opt["s_par_id"])){
      where_arr.push("AND game_id='"+this.s_list_opt["s_par_id"]+"'");
    }

    return where_arr;
  }
}
module.exports=ListAction;