var BaseWrite=require(global.LygLandConstant.ABS+'model/base/common/write/BaseWrite');
var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var CheckData=require('./check/check_data');

class WriteAction extends BaseWrite
{
  async prev_func(optObj){
    var check_rs=await CheckData.action(optObj);
    if(check_rs['result']!='true'){
      return Response.get({'result':'false','msg':'데이터 체그 중 오류.'+check_rs['msg']});
    }
    optObj["col_val_arr"]=check_rs['data']['col_val_arr'];
    
    return Response.getResultJson({"data":{"col_val_arr":optObj["col_val_arr"]}});
  }
  async after_func(optObj){
    
    return Response.getResultJson({"data":{"col_val_arr":optObj["col_val_arr"]}});
  }
}
module.exports=WriteAction;