var Response = require(global.LottoConstant.ABS + 'lib/response/response');
var DateFunc=require(global.LottoConstant.ABS+'lib/lyg/date_func');
var NextCrolling=require(global.LottoConstant.ABS+"service/lotto/number_list/next_crolling");

class PerHourSchedule{
  static async action(inData){
    let opt_obj={
      ...inData
    };

    let now_date_json=DateFunc.get_date_json(new Date());
    if(now_date_json.day==6&&parseInt(now_date_json.h)>20){
      await NextCrolling.action({});
    }

    return Response.get();
  };
}
module.exports = PerHourSchedule;