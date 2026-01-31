var Response=require(global.LygLandConstant.ABS+'lib/response/response');
var DateFunc=require(global.LygLandConstant.ABS+'lib/lyg/date_func');

class CheckData
{
  static async action(inOptObj){
    var optObj = {};
    for(var key in inOptObj){
      optObj[key] = inOptObj[key];
    }

    //아이디 중복검사
    if(optObj['col_val_arr']["user_user_id"]){
      let id_check_rs=await optObj["baseModel"].list({
        "s_id":optObj['col_val_arr']["user_user_id"],
        "s_except_user_seq":optObj['col_val_arr']["user_seq"],
        "is_need_count":"",
        "is_need_info_arr":"1",
        "is_no_limit":"1",
      });
      if(id_check_rs["data"]["info_arr"].length>0){
        return Response.get({"result":"false","msg":"중복된 아이디가 있습니다."+optObj['col_val_arr']["user_user_id"],'data':result_data_arr});
      }
    }

    //password 없애기
    if(optObj['col_val_arr']['user_user_pw']!=undefined
      &&optObj['col_val_arr']['user_user_pw']==''){
      delete optObj['col_val_arr']['user_user_pw'];
    }

    var result_data_arr={
      'col_val_arr':optObj['col_val_arr']
    };
    return Response.get({'data':result_data_arr});
  }
}
module.exports=CheckData;