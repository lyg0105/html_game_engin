var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var CheckById=require("../token/check_by_id");
var GetRefreshToken=require("../token/get_refresh");
var AddLog = require(LygLandConstant.ABS+"service/comp/basic/log_login/add_log/add_log");

class CheckLogin
{
  static async action(in_opt_obj){
    var opt_obj={
      "token_id":"",
      "is_add_client_info":"1",
      "is_refresh":"",
      "is_login_log":"1",
      "req":null,
    };
    for(var key in in_opt_obj){
      opt_obj[key]=in_opt_obj[key];
    }

    let check_rs=await CheckById.action(opt_obj);
    if(check_rs["result"]!="true"){
      return Response.get({"result": "false","msg":"로그인 체크 중 오류."+check_rs["msg"]});
    }

    if(opt_obj["is_refresh"]=="1"){
      let refresh_rs=await GetRefreshToken.action({
        "token_id":opt_obj["token_id"],
        "req":opt_obj["req"],
      });
      if(refresh_rs["result"]!="true"){
        return Response.get({"result": "false","msg":"로그인 새로고침 중 오류."+refresh_rs["msg"]});
      }
      opt_obj["is_add_client_info"]="1";
      opt_obj["token_id"]=refresh_rs["data"]["token_id"];
      check_rs["data"]["login_info"]=refresh_rs["data"]["login_info"];
      check_rs["data"]["client_info"]=refresh_rs["data"]["client_info"];
    }

    //로그인로그 등록
    if(opt_obj["req"]&&check_rs["data"]["login_info"]){
      if(opt_obj["is_login_log"]=="1"){
        var addRowRs=await AddLog.action({
          "req":opt_obj["req"],
          "user_info":check_rs["data"]["login_info"]["user_info"],
          "mcomp_info":check_rs["data"]["login_info"]["mcomp_info"],
          "sort":"check"
        });
        if(addRowRs["result"]!="true"){
          return Response.get({"result":"false","msg":"로그인 기록 중 오류."+addRowRs["msg"]});
        }
      }
    }

    var result_data={
      'token_id':opt_obj["token_id"],
    };
    if(opt_obj["is_add_client_info"]=="1"){
      result_data["client_info"]=check_rs["data"]["client_info"];
    }

    return Response.get({"data":result_data});
  }
}
module.exports=CheckLogin;