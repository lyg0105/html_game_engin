var Response = require(LygLandConstant.ABS + 'lib/response/response');
var ScoreMonthRankModel = require(LygLandConstant.ABS+"model/model/comp/game/score_month_rank");

class List
{
  static async action(in_opt_obj){
    let opt_obj={
      login_info:null,
      data_arr:[],
      ...in_opt_obj
    };

    let tableModel=new ScoreMonthRankModel({login_info:opt_obj["login_info"]});
    let list_rs=await tableModel.list(opt_obj);

    return list_rs;
  }
}
module.exports=List;