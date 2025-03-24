//var NumberListService=require(LottoConstant.ABS+"service/lotto/number_list");
var LottoCrolling=require("./lotto_crolling");
var NextCrolling=require("./next_crolling");
var List=require("./list");

class NumberListService
{
  async lotto_crolling(inData){
    return await LottoCrolling.action(inData);
  };
  async next_crolling(inData){
    return await NextCrolling.action(inData);
  };
  async list(inData){
    return await List.action(inData);
  };
}
module.exports = NumberListService;