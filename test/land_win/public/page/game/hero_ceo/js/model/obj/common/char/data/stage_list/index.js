class StageListData {
  default_stage = {
    id: "",
    name: "",
    w:1000,
    h:1000,
    start_point:{x:100,y:100},
    end_sec:60,
    monster_cnt:10,
    monster_level:1,
    monster_race_arr:[
      "고블린","사슴"
    ],
    monster_job_arr:[
      "전사"
    ],
    has_king:false,
  };
  stage_arr=[];
  
  constructor() {
    let this_obj = this;
    this_obj.init();
  }
  init() {
    let this_obj = this;
    let main=this_obj.main;
    this_obj.stage_arr=[];
    let level_len=5;

    //stage1
    for(let level_i=1;level_i<=level_len;level_i++){
      this_obj.stage_arr.push({
        ...this_obj.default_stage,
        monster_level:level_i,
        monster_race_arr:["고블린","사슴"],
        monster_job_arr:["전사"],
      });
    }
  }
}
export default StageListData;