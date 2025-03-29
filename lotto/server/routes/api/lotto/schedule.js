var BaseApi = require(LottoConstant.ABS + "routes/api/base_api");
var ScheduleService=require(LottoConstant.ABS+"service/lotto/schedule");

class ApiClass extends BaseApi {
  async per_min(in_opt_obj) {
    let customService=new ScheduleService();
    return await customService.per_min(in_opt_obj);
  }
  async per_hour(in_opt_obj) {
    let customService=new ScheduleService();
    return await customService.per_hour(in_opt_obj);
  }
}

module.exports = ApiClass;
