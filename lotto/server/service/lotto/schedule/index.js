//var ScheduleService=require(LottoConstant.ABS+"service/lotto/schedule");
var PerMinSchedule=require("./per_min");
var PerHourSchedule=require("./per_hour");

class ScheduleService
{
  async per_min(inData){
    return await PerMinSchedule.action(inData);
  };
  async per_hour(inData){
    return await PerHourSchedule.action(inData);
  };
}
module.exports = ScheduleService;