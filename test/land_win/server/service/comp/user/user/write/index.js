var Response = require(LygLandConstant.ABS + 'lib/response/response');
class Write
{
  static async action(in_opt_obj){
    let opt_obj={
      data_arr:[],
      ...in_opt_obj
    };
    return Response.get();
  }
}
module.exports=Write;