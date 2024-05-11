var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var StrFunc=require(global.LygLandConstant.ABS+'lib/lyg/string_func');
var TokenModel = require(LygLandConstant.ABS+"model/model/comp/basic/token");

class CheckById
{
  static async action(in_opt_obj){
    var opt_obj={
      "token_id":"",
      "is_add_client_info":"1",
      req:null,
    };
    for(var key in in_opt_obj){
      opt_obj[key] = in_opt_obj[key];
    }
    if(StrFunc.is_empty(opt_obj["token_id"])){
      return Response.get({"result":"false","msg":"키없음."});
    }
    var tokenModel=new TokenModel();
    var token_list_opt={
      "s_token_id":opt_obj["token_id"],
      "is_need_count":"",
      "is_need_info_arr":"1",
      "is_no_limit":"1",
    };
    var token_list_rs=await tokenModel.list(token_list_opt);
    if(token_list_rs["data"]["info_arr"].length==0){
      return Response.get({"result":"false","msg":"로그인 정보 없음."});
    }
    var token_info=token_list_rs["data"]["info_arr"][0];
    var token_data=token_info["a_data"];
    token_data=Buffer.from(token_data, "base64").toString('utf8');
    var login_info=JSON.parse(token_data);
    login_info["req"]=opt_obj["req"];

    var result_data_arr={
      "login_info":login_info
    };

    var now_d=new Date();
    var expire_d=new Date(token_info["a_expire_date"]);
    if(now_d.getTime()>expire_d.getTime()){
      return Response.get({"result":"false","msg":"로그인 만료됨."});
    }

    if(opt_obj["is_add_client_info"]==""){
      return Response.get({"data":result_data_arr});
    }

    result_data_arr["client_info"]={
      user_id:login_info.user_info["a_user_id"],
      user_seq:login_info.user_info["a_seq"],
      user_name:login_info.user_info["a_user_name"],
      user_grade:login_info.user_info["a_user_grade"],
    };

    return Response.get({"data":result_data_arr});
  }
}
module.exports=CheckById;