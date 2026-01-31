var Response = require(LygLandConstant.ABS + 'lib/response/response');
var ScoreHistoryModel = require(LygLandConstant.ABS+"model/model/comp/game/score_history");

class Delete
{
  static async action(in_opt_obj){
    let opt_obj={
      login_info:null,
      data_arr:[],
      ...in_opt_obj
    };

    let tableModel=new ScoreHistoryModel({login_info:opt_obj["login_info"]});
    let delete_rs=await tableModel.delete(opt_obj);

    return delete_rs;
  }
}
module.exports=Delete;