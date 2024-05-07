var BaseWrite=require(global.LygLandConstant.ABS+'model/base/common/write/BaseWrite');
var Response=require(global.LygLandConstant.ABS+'lib/response/response');

class WriteAction extends BaseWrite
{
  async prev_func(optObj){
    
    return Response.getResultJson({"data":{"col_val_arr":optObj["col_val_arr"]}});
  }
  async after_func(optObj){
    
    return Response.getResultJson({"data":{"col_val_arr":optObj["col_val_arr"]}});
  }
}
module.exports=WriteAction;