var Response = require(LygLandConstant.ABS + 'lib/response/response');
var ScoreHistoryModel = require(LygLandConstant.ABS+"model/model/comp/game/score_history");

class Write
{
  static async action(in_opt_obj){
    let opt_obj={
      login_info:null,
      data_arr:[],
      ...in_opt_obj
    };

    let tableModel=new ScoreHistoryModel({login_info:opt_obj["login_info"]});
    let write_rs=await tableModel.write(opt_obj);

    return write_rs;
  }
}
module.exports=Write;