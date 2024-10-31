//var TodoTimeFunc=require(global.LottoConstant.ABS+'lib/lyg/todo_time_func');
var StrFunc=require(global.LottoConstant.ABS+'lib/lyg/string_func');
class TodoTimeFunc {
  static get_elapse_time_sec_by_todo_info(todo_info){
    let elapse_time_sec=0;
    let a_time_sec=parseInt(StrFunc.uncomma(todo_info.a_time_sec));
    if(todo_info.a_state=="ing"&&todo_info.a_start_date_last
      &&todo_info.a_start_date_last.substring(0,10)!="0000-00-00"){
      //진행시간 업데이트
      let last_date_msec=new Date(todo_info.a_start_date_last).getTime();
      let now_date_msec=new Date().getTime();
      let plus_sec=Math.floor((now_date_msec-last_date_msec)/1000);
      a_time_sec=a_time_sec+plus_sec;
      a_time_sec=Math.round(a_time_sec);
    }
    elapse_time_sec=a_time_sec;
    return elapse_time_sec;
  }
}
module.exports = TodoTimeFunc;