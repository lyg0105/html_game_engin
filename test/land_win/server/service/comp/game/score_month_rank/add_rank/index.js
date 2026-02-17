var Response = require(LygLandConstant.ABS + 'lib/response/response');
var StrFunc = require(global.LygLandConstant.ABS + 'lib/lyg/string_func');
var DateFunc = require(global.LygLandConstant.ABS + 'lib/lyg/date_func');
var ScoreMonthRankModel = require(LygLandConstant.ABS + "model/model/comp/game/score_month_rank");
var ScoreHistoryModel = require(LygLandConstant.ABS+"model/model/comp/game/score_history");

class AddRank {
  static async action(in_opt_obj) {
    let opt_obj = {
      login_info: null,
      data_arr: [],
      ...in_opt_obj
    };
    let this_obj=this;
    let rankModel = new ScoreMonthRankModel({ login_info: opt_obj["login_info"] });

    //이력저장
    let historyModel=new ScoreHistoryModel({login_info:opt_obj["login_info"]});
    let history_rs=await historyModel.write(opt_obj);
    if(history_rs["result"]!="true"){
      return Response.get({"result":"false","msg":"이력 저장 실패."+history_rs["msg"]});
    }

    for(let i=0;i<opt_obj["data_arr"].length;i++){
      let row_data=opt_obj["data_arr"][i];
      let add_rs=await this_obj.add_rank_one({
        login_info: opt_obj["login_info"],
        row_data: row_data,
        rankModel:rankModel
      });
      if(add_rs["result"]!="true"){
        return add_rs;
      }
    }

    return Response.get();
  }

  static async add_rank_one(inData) {
    let opt_obj = {
      login_info: null,
      row_data: {},
      rankModel: null,
      ...inData
    };
    let login_info = opt_obj["login_info"];
    let rankModel = opt_obj["rankModel"];
    let row_data = opt_obj["row_data"];

    // if(StrFunc.is_empty(login_info)){
    //   return Response.get();
    // }
    if (StrFunc.is_empty(row_data)) {
      return Response.get({ "result": "false", "msg": "등록할 데이터 없음." });
    }
    if (StrFunc.is_empty(row_data["a_score"])
      || StrFunc.is_empty(row_data["a_user_name"])
      || StrFunc.is_empty(row_data["a_id"])) {
      return Response.get({ "result": "false", "msg": "등록할 데이터 부족." });
    }

    //더 높은 점수 있는지 조회
    let now_ymdhis = DateFunc.get_date_format(new Date(), "Y-m-d h:i:s");
    let now_ym = DateFunc.get_date_format(new Date(), "Ym");
    let s_start_date = DateFunc.get_date_format(new Date(), "Y-m-01");
    let s_end_date = DateFunc.get_date_format(new Date(), "Y-m-t");

    let pre_rank_rs = await rankModel.list({
      s_date_type: "a_date",
      s_start_date: s_start_date,
      s_end_date: s_end_date,
      s_par_id: row_data["a_id"],
      s_user_name: row_data["a_user_name"],
      //s_score_min: row_data["a_score"],
      is_paging: "",
    });
    let pre_rank_info=null;
    if (pre_rank_rs["data"]["info_arr"].length > 0) {
      pre_rank_info=pre_rank_rs["data"]["info_arr"][0];
    }

    if(pre_rank_info!=null){
      if(pre_rank_info["a_score"]>=row_data["a_score"]){
        return Response.get({ "result": "true", "msg": "더 높은 점수 존재." });
      }
    }

    //등록
    let add_data = {
      ...opt_obj["row_data"],
      a_ymd: now_ym,
      a_date: now_ymdhis,
      a_user_seq:"",
      a_loop_cnt:1,
    };
    if(pre_rank_info!=null){
      add_data.a_loop_cnt=pre_rank_info["a_loop_cnt"]+1;
    }

    let add_rs = await rankModel.write({
      data_arr: [add_data]
    });
    if (add_rs["result"] != "true") {
      return Response.get({ "result": "false", "msg": "등록 실패." + add_rs["msg"] });
    }
    return Response.get();
  }
}
module.exports = AddRank;