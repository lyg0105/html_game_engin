var Response = require(global.LottoConstant.ABS + 'lib/response/response');
var LottoModel = require(LottoConstant.ABS+"model/model/lotto/lotto");

class List {
  static async action(inData) {
    let opt_obj = {
      ...inData
    };

    let lottoModel=new LottoModel();
    let list_rs=await lottoModel.list(opt_obj);
    
    return list_rs;
  };
}
module.exports = List;