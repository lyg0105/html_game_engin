//var BaseApi= require(LottoConstant.ABS+"routes/api/base_api");
class BaseApi
{
  request=null;
  response=null;
  constructor(req,res){
    this.request=req;
    this.response=res;
  }
}
module.exports = BaseApi;