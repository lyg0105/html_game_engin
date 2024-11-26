var Response = require(global.LottoConstant.ABS + 'lib/response/response');
var Model = require(global.LottoConstant.ABS + 'model/base/model');
var StrFunc = require(global.LottoConstant.ABS + 'lib/lyg/string_func');
var fetch = require("node-fetch");

class LottoCrolling {
  static async action(inData) {
    let opt_obj = {
      drw_no: "",
      ...inData
    };
    let search_drw_no = opt_obj.drw_no;
    if (StrFunc.is_empty(search_drw_no)) {
      return Response.get({ result: "false", msg: "회차번호가 없습니다." });
    }

    let model = new Model();
    let info_arr = await model.list({
      t: "lotto_number_list",
      w: ["AND drw_no='" + search_drw_no + "'"],
      limit: "",
    });
    if (info_arr.length > 0) {
      return Response.get({ result: "false", msg: "이미 존재하는 회차입니다." });
    }
    let crolling_url="https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=" + search_drw_no;
    const response = await fetch(crolling_url);
    const jsonData = await response.json();
    if (jsonData.returnValue == "success") {
      let lotto_col_val_arr = {
        drw_no: jsonData.drwNo,
        drw_no_date: jsonData.drwNoDate,
        drwt_no1: jsonData.drwtNo1,
        drwt_no2: jsonData.drwtNo2,
        drwt_no3: jsonData.drwtNo3,
        drwt_no4: jsonData.drwtNo4,
        drwt_no5: jsonData.drwtNo5,
        drwt_no6: jsonData.drwtNo6,
        bnus_no: jsonData.bnusNo,
        first_winamnt: jsonData.firstWinamnt,
        first_przwner_co: jsonData.firstPrzwnerCo,
        first_accumamnt: jsonData.firstAccumamnt,
        tot_sellamnt: jsonData.totSellamnt,
        return_value: jsonData.returnValue
      };

      let is_success = await model.insert({
        t: "lotto_number_list",
        col_val_arr: lotto_col_val_arr
      });
      if (is_success==false) {
        return Response.get({ result: "false", msg: "저장 중 오류." });
      }
    }else{
      return Response.get({ result: "false", msg: "데이터가 없습니다." });
    }

    return Response.get();
  };
}
module.exports = LottoCrolling;