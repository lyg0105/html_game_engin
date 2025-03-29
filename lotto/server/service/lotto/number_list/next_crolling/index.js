var Response = require(global.LottoConstant.ABS + 'lib/response/response');
var LottoCrolling= require(global.LottoConstant.ABS+"service/lotto/number_list/lotto_crolling");
var Model = require(global.LottoConstant.ABS + 'model/base/model');
var StrFunc=require(global.LottoConstant.ABS+'lib/lyg/string_func');
var DateFunc=require(global.LottoConstant.ABS+'lib/lyg/date_func');

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
    let last_drw_no_date="2025-01-01";
    if (info_arr.length > 0) {
      next_drw_no=parseInt(StrFunc.uncomma(info_arr[0].drw_no));
      last_drw_no_date=info_arr[0].drw_no_date;
    }
    let now_ymd=DateFunc.get_date_format(new Date(),"Y-m-d");
    let next_ymd=DateFunc.get_date_format(DateFunc.get_change_date(new Date(last_drw_no_date),'day',+7),"Y-m-d");
    //마지막의 7일 후보다 현재가 더 크면 다음 회차로 넘긴다.
    if(next_ymd<=now_ymd){
      next_drw_no++;
    }
    
    let crolling_rs=await LottoCrolling.action({drw_no:next_drw_no});
    return crolling_rs;
  };
}
module.exports = NextCrolling;