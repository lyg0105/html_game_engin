//var ScoreMonthRankService=require(LygLandConstant.ABS+"service/comp/game/score_month_rank");
var BaseService = require(LygLandConstant.ABS + 'service/base_service');
var Write = require("./write");
var List = require("./list");
var Delete = require("./delete");
var AddRank = require("./add_rank");

class ScoreMonthRankService extends BaseService {
  async write(in_opt_obj) {
    var result_arr = await Write.action(in_opt_obj);
    return result_arr;
  }
  async list(in_opt_obj) {
    var result_arr = await List.action(in_opt_obj);
    return result_arr;
  }
  async delete(in_opt_obj) {
    var result_arr = await Delete.action(in_opt_obj);
    return result_arr;
  }
  async add_rank(in_opt_obj) {
    var result_arr = await AddRank.action(in_opt_obj);
    return result_arr;
  }
}
module.exports = ScoreMonthRankService;