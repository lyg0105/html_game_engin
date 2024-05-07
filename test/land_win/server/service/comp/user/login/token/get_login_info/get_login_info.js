//var GetLoginInfo = require(LygLandConstant.ABS+"service/comp/user/login/token/get_login_info/get_login_info");
var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var StrFunc=require(global.LygLandConstant.ABS+'lib/lyg/string_func');
var UserModel = require(LygLandConstant.ABS+"model/model/comp/basic/user");

class GetLoginInfo
{
  static async action(in_opt_obj){
    var opt_obj={
      "api_key":"",
      "user_seq":"",
      "req":null,

      "is_addon_api_key":"",
    };
    for(var key in in_opt_obj){
      opt_obj[key] = in_opt_obj[key];
    }
    if(StrFunc.is_empty(opt_obj["user_seq"])){
      return Response.get({"result":"false","msg":"회원키없음."});
    }

    var userModel=new UserModel({});
    var login_user_list_opt={
      "order_id":"a_seq",
      "order_type":"",
      "is_need_count":"",
      "is_need_info_arr":"1",
      "is_no_limit":"1",
    };
    login_user_list_opt["s_pri_arr"]=[opt_obj['user_seq']];
    var user_rs=await userModel.list(login_user_list_opt);
    if(user_rs["data"]["info_arr"].length==0){
      return Response.get({"result":"false","msg":"유저정보가 없습니다."});
    }
    var info=user_rs["data"]["info_arr"][0];
    
    var tmp_user_info={
      "a_seq":info["a_seq"],
      "a_user_id":info["a_user_id"],
      "a_user_name":info["a_user_name"],
      "a_user_nickname":info["a_user_nickname"],
      "a_user_phone":info["a_user_phone"],
      "a_email":info["a_email"],
      "a_user_grade":info["a_user_grade"],
    };
    var login_info={
      user_info:tmp_user_info,
      req:opt_obj["req"],
    };
    let result_data_arr={
      "login_info":login_info
    };

    return Response.get({"data":result_data_arr});
  }
}
module.exports=GetLoginInfo;