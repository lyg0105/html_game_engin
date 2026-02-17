var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var DateFunc=require(global.LygLandConstant.ABS+'lib/lyg/date_func');

class CheckData
{
  static async action(inOptObj){
    var optObj = {};
    for(var key in inOptObj){
      optObj[key] = inOptObj[key];
    }

    var result_data_arr={
      'col_val_arr':optObj['col_val_arr']
    };
    return Response.get({'data':result_data_arr});
  }
}
module.exports=CheckData;