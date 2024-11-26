var Response = require(global.LottoConstant.ABS + 'lib/response/response');
var Model = require(global.LottoConstant.ABS + 'model/base/model');
var DateFunc=require(global.LottoConstant.ABS+'lib/lyg/date_func');

class PerMinSchedule{
  static async action(inData){
    let opt_obj={
      ...inData
    };

    let model = new Model();

    var now_ymdhis=DateFunc.get_date_format(new Date(),"Y-m-d h:i:s");
    let log_col_val_arr={
      schedule_sort: "per_min",
      schedule_path:"/service/lotto/schedule/per_min",
      schedule_memo:"PerMinSchedule",
      schedule_create_date: now_ymdhis,
    };
    let is_success = await model.insert({
      t: "schedule_excute_log",
      col_val_arr: log_col_val_arr
    });
    if (is_success==false) {
      return Response.get({ result: "false", msg: "저장 중 오류." });
    }

    return Response.get();
  };
}
module.exports = PerMinSchedule;