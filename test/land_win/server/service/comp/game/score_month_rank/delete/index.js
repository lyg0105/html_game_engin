var Response = require(LygLandConstant.ABS + 'lib/response/response');
var ScoreMonthRankModel = require(LygLandConstant.ABS+"model/model/comp/game/score_month_rank");

class Delete
{
  static async action(in_opt_obj){
    let opt_obj={
      login_info:null,
      data_arr:[],
      ...in_opt_obj
    };

    let tableModel=new ScoreMonthRankModel({login_info:opt_obj["login_info"]});
    let delete_rs=await tableModel.delete(opt_obj);

    return delete_rs;
  }
}
module.exports=Delete;