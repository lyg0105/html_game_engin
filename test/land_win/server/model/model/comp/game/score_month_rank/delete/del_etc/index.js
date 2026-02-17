var Response=require(global.LygLandConstant.ABS+'lib/response/response');

class DeleteEtcData
{
  static async action(optObj){
    var pre_info=optObj["pre_info"];

    return Response.get({"data":{"col_val_arr":optObj["col_val_arr"]}});
  }
}
module.exports=DeleteEtcData;