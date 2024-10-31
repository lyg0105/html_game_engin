//var Response=require(global.LottoConstant.ABS+'lib/response/response');
class Response
{
  //return Response.getResultJson({"result":"false","msg":"테이블 정보 없음."});
  static getResultJson(in_result){
    if(in_result==undefined){
      in_result={};
    }
    var result_arr={
      "result":"true",
      "data":"",
      "msg":"성공",
      "error":""
    };
    for(var key in in_result){
      result_arr[key]=in_result[key];
    }
    
    return result_arr;
  }
  static get(in_result){
    return this.getResultJson(in_result);
  }
}
module.exports=Response;