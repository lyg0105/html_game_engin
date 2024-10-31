/*
사용예시
var InOptObj=require(global.LottoConstant.ABS+'lib/arr/in_opt_obj');
function action(inOptObj){
  var optObj={
    a:'1'
  };
  optObj=InOptObj.getOptByIn(optObj,inOptObj);
}
*/
class InOptObj
{
  static getOptByIn(optObj,inOptObj){
    if(optObj==undefined){
      optObj={};
    }
    if(inOptObj==undefined){
      inOptObj={};
    }
    for(var key in inOptObj){
      optObj[key]=inOptObj[key];
    }
    return optObj;
  }
}
module.exports=InOptObj;