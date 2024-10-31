//var NumberListService=require(LottoConstant.ABS+"service/lotto/number_list");
var LottoCrolling=require("./lotto_crolling");
var NextCrolling=require("./next_crolling");

class NumberListService
{
  async lotto_crolling(inData){
    return await LottoCrolling.action(inData);
  };
  async next_crolling(inData){
    return await NextCrolling.action(inData);
  };
}
module.exports = NumberListService;