var Response = require(global.LottoConstant.ABS + 'lib/response/response');
var LottoCrolling= require(global.LottoConstant.ABS+"service/lotto/number_list/lotto_crolling");
var Model = require(global.LottoConstant.ABS + 'model/base/model');
var StrFunc=require(global.LottoConstant.ABS+'lib/lyg/string_func');

class NextCrolling{
  static async action(inData){
    let opt_obj={
      ...inData
    };

    let next_drw_no=0;
    let model = new Model();
    let info_arr = await model.list({
      t: "lotto_number_list",
      w: [" ORDER BY drw_no DESC LIMIT 1"],
      limit: "",
    });
    
    if (info_arr.length > 0) {
      next_drw_no=parseInt(StrFunc.uncomma(info_arr[0].drw_no));
    }
    next_drw_no++;
    let crolling_rs=await LottoCrolling.action({drw_no:next_drw_no});
    return crolling_rs;
  };
}
module.exports = NextCrolling;