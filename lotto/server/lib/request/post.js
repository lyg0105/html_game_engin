//var PostRequest=require(global.LottoConstant.ABS+'lib/request/post');
const request = require('request'); // POST 요청하기
class PostRequest
{
  static send(in_opt_obj){
    if(in_opt_obj==undefined){in_opt_obj={};}
    var optObj={
      "url":"",
      "form_data":""
    };
    for(var key in in_opt_obj){
      optObj[key]=in_opt_obj[key];
    }
    const options = { 
      uri:optObj["url"], //http://google.com
      method: 'POST', 
      form: optObj["form_data"], //{ id:'1000', name:'joe', }
      json:true 
    };
    return new Promise(function(resolve, reject) {
      request.post(options, function (error, response, body) { 
        //callback
        resolve({
          'error':error,
          'response':response,
          'body':body
        });
      });
    });
  }
}
 module.exports=PostRequest;