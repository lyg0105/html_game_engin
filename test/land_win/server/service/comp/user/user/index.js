//var UserService=require(LygLandConstant.ABS+"service/comp/user/user");
var BaseService= require(LygLandConstant.ABS+'service/base_service');
var Write=require("./write");
var List=require("./list");
var Delete=require("./delete");

class UserService extends BaseService
{
  async write(in_opt_obj){
    var result_arr=await Write.action(in_opt_obj);
    return result_arr;
  }
  async list(in_opt_obj){
    var result_arr=await List.action(in_opt_obj);
    return result_arr;
  }
  async delete(in_opt_obj){
    var result_arr=await Delete.action(in_opt_obj);
    return result_arr;
  }
}
module.exports=UserService;