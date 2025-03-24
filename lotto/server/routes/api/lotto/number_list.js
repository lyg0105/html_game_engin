var BaseApi = require(LottoConstant.ABS + "routes/api/base_api");
var NumberListService=require(LottoConstant.ABS+"service/lotto/number_list");

class ApiClass extends BaseApi {
  async lotto_crolling(in_opt_obj) {
    let numberListService=new NumberListService();
    return await numberListService.lotto_crolling(in_opt_obj);
  }
  async next_crolling(in_opt_obj) {
    let numberListService=new NumberListService();
    return await numberListService.next_crolling(in_opt_obj);
  }
  async list(in_opt_obj){
    let numberListService=new NumberListService();
    return await numberListService.list(in_opt_obj);
  }
}

module.exports = ApiClass;
