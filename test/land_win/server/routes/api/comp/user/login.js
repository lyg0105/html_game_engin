var BaseApi= require(LygLandConstant.ABS+"routes/api/base_api");
var LoginService=require(LygLandConstant.ABS+"service/comp/user/login");
class LoginClass extends BaseApi
{
  async test(in_opt_obj){
    var result_arr={"result":"true","data":{},"msg":"성공"};
    return result_arr;
  }
  async login(in_opt_obj){
    let customService=new LoginService();
    in_opt_obj.req=this.request;
    return await customService.login(in_opt_obj);
  }
}

module.exports = LoginClass;
