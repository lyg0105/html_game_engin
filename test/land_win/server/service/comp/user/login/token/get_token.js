var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var StrFunc=require(global.LygLandConstant.ABS+'lib/lyg/string_func');
var DateFunc=require(global.LygLandConstant.ABS+'lib/lyg/date_func');
const { v4: uuidv4 } = require('uuid');

var TokenModel = require(LygLandConstant.ABS+"model/model/comp/basic/token");
var GetLoginInfo = require(LygLandConstant.ABS+"service/comp/user/login/token/get_login_info/get_login_info");

class GetLoginToken
{
  static async action(in_opt_obj){
    var opt_obj={
      "user_seq":"",
      "req":null,
      "expire_day":365*10,
      "is_front":"",
    };
    for(var key in in_opt_obj){
      opt_obj[key] = in_opt_obj[key];
    }
    let login_info_rs=await GetLoginInfo.action({
      "user_seq":opt_obj["user_seq"],
      "req":opt_obj["req"],
    });
    if(login_info_rs["result"]!="true"){
      return Response.get({"result":"false","msg":"로그인정보 얻는 중 오류."+login_info_rs["msg"]});
    }

    var login_info=login_info_rs["data"]["login_info"];

    var result_data_arr={
      "app_name":LygLandConstant.APP_NAME
    };
    if(opt_obj["is_front"]!="1"){
      result_data_arr["login_info"]=login_info;
    }
    result_data_arr["client_info"]={
      user_id:login_info.user_info["a_user_id"],
      user_seq:login_info.user_info["a_seq"],
      user_name:login_info.user_info["a_user_name"],
      user_grade:login_info.user_info["a_user_grade"],
    };
    var token_id=opt_obj["user_seq"]+"_"+uuidv4();
    delete login_info["req"];
    var token=Buffer.from(JSON.stringify(login_info), "utf8").toString('base64');
    login_info["req"]=opt_obj["req"];
    result_data_arr["token_id"]=token_id;

    if(StrFunc.is_empty(opt_obj["expire_day"])){
      opt_obj["expire_day"]=365*10;
    }
    opt_obj["expire_day"]=StrFunc.getNumber(opt_obj["expire_day"]);
    opt_obj["expire_day"]=parseInt(opt_obj["expire_day"]);
    
    var expire_d_obj=DateFunc.get_change_date(new Date(),'day',opt_obj["expire_day"]);
    var expire_date=DateFunc.get_date_format(expire_d_obj,"Y-m-d");
    var tokenModel=new TokenModel();
    var w_token_row={
      a_id:token_id,
      a_user_seq:opt_obj["user_seq"],
      a_expire_date:expire_date,
      a_data:token,
    };
    if(opt_obj["req"]!=null){
      var log_agent = opt_obj["req"].header('User-Agent');
      w_token_row["a_ip"]=opt_obj["req"].ip;
      w_token_row["a_server_ip"]=opt_obj["req"].hostname;
      w_token_row["a_agent"]=log_agent;
    }
    var token_w_rs=await tokenModel.write({
      "data_arr":[w_token_row],
      "is_default_val":"1"
    });
    if(token_w_rs['result']!='true'){
      return Response.get({"result":"false","msg":"토큰 저장중 오류."+token_w_rs["msg"]});
    }

    return Response.get({"data":result_data_arr});
  }
}
module.exports=GetLoginToken;