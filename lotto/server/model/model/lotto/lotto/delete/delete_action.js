var BaseDelete=require(global.LottoConstant.ABS+'model/base/common/delete/BaseDelete');
var Response=require(global.LottoConstant.ABS+'lib/response/response');
const fs = require('fs');

class DeleteAction extends BaseDelete
{
  prev_func(optObj){
    var pre_info=optObj["pre_info"];

    return Response.getResultJson({"data":{"col_val_arr":optObj["col_val_arr"]}});
  }
  after_func(optObj){
    return Response.getResultJson({"data":{"col_val_arr":optObj["col_val_arr"]}});
  }
}
module.exports=DeleteAction;