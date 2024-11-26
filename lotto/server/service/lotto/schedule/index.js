//var ScheduleService=require(LottoConstant.ABS+"service/lotto/schedule");
var PerMinSchedule=require("./per_min");

class ScheduleService
{
  async per_min(inData){
    return await PerMinSchedule.action(inData);
  };
}
module.exports = ScheduleService;