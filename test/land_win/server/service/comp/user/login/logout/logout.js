var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var DeleteById=require("../token/delete_by_id");

class Logout
{
  static async action(in_opt_obj){
    var opt_obj={
      "token_id":"",
      "app_sort":"other",
      "req":null,
      "is_login_log": "1",
    };
    for(var key in in_opt_obj){
      opt_obj[key]=in_opt_obj[key];
    }

    var del_token_rs=await DeleteById.action(opt_obj);
    if(del_token_rs["result"]!="true"){
      return Response.get({"result":"false","msg":"로그인데이터 삭제 중 오류."+del_token_rs["msg"]});
    }
    var result_data={
      'app_name':LygLandConstant.APP_NAME
    };
    var result={
      "result":"true",
      "data":result_data,
      "msg":"성공"
    };
    
    return Response.get(result);
  }
}
module.exports=Logout;