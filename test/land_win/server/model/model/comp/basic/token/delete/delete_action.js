var BaseDelete=require(global.LygLandConstant.ABS+'model/base/common/delete/BaseDelete');
var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var DeleteEtcData=require("./del_etc");

class DeleteAction extends BaseDelete
{
  async prev_func(optObj){
    var pre_info=optObj["pre_info"];

    let del_etc_rs=await DeleteEtcData.action(optObj);
    if(del_etc_rs["result"]!="true"){
      return Response.get({"result":"false","msg":"기타삭제 중 오류.","data":del_etc_rs["data"]});
    }

    return Response.getResultJson({"data":{"col_val_arr":optObj["col_val_arr"]}});
  }
  async after_func(optObj){
    return Response.getResultJson({"data":{"col_val_arr":optObj["col_val_arr"]}});
  }
}
module.exports=DeleteAction;