var Response = require(LygLandConstant.ABS + 'lib/response/response');
var UserModel = require(LygLandConstant.ABS+"model/model/comp/basic/user");
var GetLoginToken = require(LygLandConstant.ABS + "service/comp/user/login/token/get_token");
var StrFunc = require(LygLandConstant.ABS + 'lib/lyg/string_func');
var DateFunc = require(LygLandConstant.ABS + 'lib/lyg/date_func');

class Login {
  static async action(in_opt_obj) {
    var opt_obj = {
      "user_seq": "",
      "id": "",
      "pw": "",
      "req": null,
      "is_no_pw_login": "",
      "is_login_log": "1",
      ...in_opt_obj,
    };
    if (opt_obj['id'] == "" && opt_obj['user_seq'] == "") {
      return Response.get({ "result": "false", "msg": "아이디 입력 필요." });
    }
    if (opt_obj['is_no_pw_login'] == "") {
      if (opt_obj['pw'] == "") {
        return Response.get({ "result": "false", "msg": "암호 입력 필요." });
      }
    }

    var userModel = new UserModel({});

    //유저 한개라도 있는지 확인
    var user_count_rs = await userModel.list({
      "is_need_count": "1",
      "is_need_info_arr": "",
      "is_no_limit": "1",
    });
    if (parseInt(user_count_rs["data"]["count_info"]["tot"]) == 0) {
      return Response.get({ "result": "false", "data": { "error_type": "init" }, "msg": "초기화 데이터가 필요합니다." });
    }
    var user_search_opt = {
      "s_id": opt_obj['id'],
      "s_pw": opt_obj['pw'],
      "is_need_count": "",
      "is_need_info_arr": "1",
      "is_no_limit": "1",
    };
    if (!StrFunc.is_empty(opt_obj["user_seq"])) {
      user_search_opt["s_pri_arr"] = [opt_obj["user_seq"]];
      user_search_opt["s_id"] = "";
    }
    if (opt_obj['is_no_pw_login'] == "1") {
      user_search_opt["s_pw"] = "";
    }
    var user_rs = await userModel.list(user_search_opt);
    if (user_rs["data"]["info_arr"].length == 0) {
      return Response.get({ "result": "false", "msg": "아이디 또는 암호가 맞지 않습니다." });
    }
    var info = user_rs["data"]["info_arr"][0];
    if (info["a_is_login"] != "1") {
      return Response.get({ "result": "false", "msg": "로그인 권한이 없습니다." });
    }
    var token_rs = await GetLoginToken.action({
      "user_seq": info["a_seq"],
      "req": opt_obj["req"],
    });
    if (token_rs["result"] != "true") {
      return Response.get({ "result": "false", "msg": "토큰얻는중 오류." + token_rs["msg"] });
    }
    
    //로그인 카운트 +1
    let now_login_cnt = info["a_login_cnt"];
    if (StrFunc.is_empty(now_login_cnt)) {
      now_login_cnt = "0";
    }
    now_login_cnt = parseInt(now_login_cnt);
    now_login_cnt++;
    let updateLoginCountRow = {
      "a_seq": info["a_seq"],
      "a_login_cnt": now_login_cnt,
      "a_last_login_date": DateFunc.get_date_format(new Date(), "Y-m-d h:i:s")
    };
    let upCntRs = await userModel.write({
      "is_update": "1",
      "data_arr": [updateLoginCountRow]
    });
    if (upCntRs["result"] != "true") {
      return Response.get({ "result": "false", "msg": "로그인 카운트 중 오류." + upCntRs["msg"] });
    }

    var token_id = token_rs["data"]["token_id"];
    var result_data = {
      'token_id': token_id,
      'app_name': token_rs["data"]["app_name"],
      'client_info': token_rs["data"]["client_info"],
    };

    var result = {
      "result": "true",
      "data": result_data,
      "msg": "성공"
    };

    return Response.get(result);
  }
}
module.exports = Login;