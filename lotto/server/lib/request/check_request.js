var StrFunc=require(global.LottoConstant.ABS+'lib/lyg/string_func');

class CheckRequest
{
  static checkRequestData(data){
    if(data==undefined||data==null){
      data="";
    }

    let except_key_arr=[
      "files",
      "login_info",
    ];
    if(global.LottoConstant.IS_TEST=="1"){
      except_key_arr.push("query_str");
    }

    if(typeof data=="object"){
      for(let key in data){
        if(StrFunc.str_in_array(key, except_key_arr)!=-1){
          data[key]=data[key];
        }else{
          data[key]=this.checkRequestData(data[key]);
        }
      }
    }else{
      data=StrFunc.escapeHtml(data);
      data=StrFunc.checkInputStr(data);
      return data;
    }

    return data;
  }
}
module.exports=CheckRequest;