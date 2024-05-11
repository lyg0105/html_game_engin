var CheckById = require(LygLandConstant.ABS+'service/comp/user/login/token/check_by_id');
var GetLoginInfo = require(LygLandConstant.ABS+"service/comp/user/login/token/get_login_info/get_login_info");

async function check(req,res,next){
  if(req.body.api_user_seq){
    let login_info_rs=await GetLoginInfo.action({
      "user_seq":req.body.api_user_seq,
      req:req,
    });
    if(login_info_rs["result"]=="true"){
      req.body.login_info=login_info_rs["data"]["login_info"];
    }
  }else if(req.body.api_token_id){
    let check_login_token_rs=await CheckById.action({
      "token_id":req.body.api_token_id,
      req:req,
    });
    if(check_login_token_rs["result"]=="true"){
      req.body.login_info=check_login_token_rs["data"]["login_info"];
    }
  }
  next();
}
module.exports = check;
