var BaseApi = require(LygLandConstant.ABS + "routes/api/base_api");
var ScoreMonthRankService = require(LygLandConstant.ABS + "service/comp/game/score_month_rank");

class APIClass extends BaseApi {
  async write(in_opt_obj) {
    let customService = new ScoreMonthRankService();
    return await customService.write(in_opt_obj);
  }
  async list(in_opt_obj) {
    let customService = new ScoreMonthRankService();
    return await customService.list(in_opt_obj);
  }
  async delete(in_opt_obj) {
    let customService = new ScoreMonthRankService();
    return await customService.delete(in_opt_obj);
  }
  async add_rank(in_opt_obj) {
    let customService = new ScoreMonthRankService();
    return await customService.add_rank(in_opt_obj);
  }
}

module.exports = APIClass;
