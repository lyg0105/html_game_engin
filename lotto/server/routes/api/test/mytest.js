var BaseApi = require(LottoConstant.ABS + "routes/api/base_api");
var Model = require(global.LottoConstant.ABS + 'model/base/model');
var Response = require(global.LottoConstant.ABS + 'lib/response/response');
var NumberListService=require(LottoConstant.ABS+"service/lotto/number_list");

class TestClass extends BaseApi {
  async test(in_opt_obj) {
    var result_arr = { "result": "true", "data": {}, "msg": "성공" };
    return result_arr;
  }
  async test2(in_opt_obj) {
    let model = new Model();
    let info_arr = await model.list({
      t: "lotto_number_list",
      limit: 10,
    });

    let result_data_arr = {
      info_arr: info_arr
    };
    return Response.get({ data: result_data_arr });
  }
  async lotto_crolling(in_opt_obj) {
    let numberListService=new NumberListService();
    let crolling_rs=await numberListService.lotto_crolling(in_opt_obj);
    return crolling_rs;
  }
  async lotto_crolling_all(in_opt_obj) {
    let numberListService=new NumberListService();
    let drw_num=1;
    let max_drw_num=1143;
    for(let i=drw_num;i<=max_drw_num;i++){
      let crolling_rs=await numberListService.lotto_crolling({drw_no:i});
      console.log(i+" "+crolling_rs["msg"]);
    }
    return Response.get();
  };
}

module.exports = TestClass;
