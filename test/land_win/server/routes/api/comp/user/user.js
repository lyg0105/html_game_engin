var BaseApi= require(LygLandConstant.ABS+"routes/api/base_api");
var UserService=require(LygLandConstant.ABS+"service/comp/user/user");

class APIClass extends BaseApi
{
  async write(in_opt_obj){
    let customService=new UserService();
    return await customService.write(in_opt_obj);
  }
  async list(in_opt_obj){
    let customService=new UserService();
    return await customService.list(in_opt_obj);
  }
  async delete(in_opt_obj){
    let customService=new UserService();
    return await customService.delete(in_opt_obj);
  }
}

module.exports = APIClass;
