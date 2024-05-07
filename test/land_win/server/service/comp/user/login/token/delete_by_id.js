var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var StrFunc=require(global.LygLandConstant.ABS+'lib/lyg/string_func');
var TokenModel = require(LygLandConstant.ABS+"model/model/comp/basic/token");

class DeleteById
{
  static async action(in_opt_obj){
    var opt_obj={
      "token_id":"",
      "app_sort":"other",
      "req":null,
    };
    for(var key in in_opt_obj){
      opt_obj[key] = in_opt_obj[key];
    }
    if(StrFunc.is_empty(opt_obj["token_id"])){
      return Response.get({"msg":"토큰 없음."});
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
      return Response.get({"msg":"토큰정보 없음."});
    }
    var token_info=token_list_rs["data"]["info_arr"][0];
    var token_data=token_info["a_data"];
    token_data=Buffer.from(token_data, "base64").toString('utf8');

    var token_del_rs=await tokenModel.delete({
      "data_arr":[{"a_id":token_info["a_id"]}]
    });
    if(token_del_rs["result"]!="true"){
      return Response.get({"msg":"토큰 삭제 중 오류."+token_del_rs["msg"]});
    }

    return Response.get();
  }
}
module.exports=DeleteById;