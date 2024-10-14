class Farm{
  main=null;
  constructor(inData){
    let opt_obj={
      main:null,
      ...inData
    };
    this.main = opt_obj.main;
    this.init();
  }
  init(){
    
  }
  atuo_toggle(){
    let this_obj = this;
    let is_auto_farm=this_obj.main.gameData.data.is_auto_farm;
    if(is_auto_farm){
      this_obj.main.gameData.data.is_auto_farm=false;
    }else{
      this_obj.main.gameData.data.is_auto_farm=true;
    }
  };
  auto_run(){
    let this_obj = this;
    let is_auto_farm=this_obj.main.gameData.data.is_auto_farm;
    if(is_auto_farm){
      let is_able_run=false;
      this_obj.main.gameData.data.farm_delay+=this_obj.main.gameProcess.loop_delay;
      if(this_obj.main.gameData.data.farm_delay>=this_obj.main.gameData.data.farm_delay_max){
        this_obj.main.gameData.data.farm_delay-=this_obj.main.gameData.data.farm_delay_max;
        is_able_run=true;
      }
      if(is_able_run){
        this_obj.run();
      }
    }
  }
  run(){
    let farm_gold=this.get_farm_gold();
    this.main.gameData.data.last_add_gold=farm_gold;
    this.main.gameData.data.gold+=farm_gold;
  }
  get_farm_gold(){
    let this_obj = this;
    let farm_min=this_obj.main.gameData.data.farm_gold_min;
    let farm_max=this_obj.main.gameData.data.farm_gold_max;
    let farm_gold=this_obj.main.func.math.random(farm_min,farm_max);
    return farm_gold;
  }
}
export default Farm;