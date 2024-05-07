//var LoginService=require(LygLandConstant.ABS+"service/comp/user/login");
var BaseService= require(LygLandConstant.ABS+'service/base_service');
var Login=require("./login/login");
var Logout=require("./logout/logout");

class LoginService extends BaseService
{
  async login(in_opt_obj){
    var result_arr=await Login.action(in_opt_obj);
    return result_arr;
  }
  async logout(in_opt_obj){
    var result_arr=await Logout.action(in_opt_obj);
    return result_arr;
  }
}
module.exports=LoginService;