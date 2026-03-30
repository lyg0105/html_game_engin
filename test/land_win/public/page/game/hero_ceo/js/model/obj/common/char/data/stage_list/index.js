class StageListData {
  default_stage = {
    id: "",
    name: "",
    w:500,
    h:800,
    start_point:{x:100,y:100},
    end_sec:60,
    monster_cnt:3,
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
      let add_level_row={
        ...this_obj.default_stage,
        monster_level:level_i,
        monster_race_arr:["고블린","사슴"],
        monster_job_arr:["전사"],
      };
      add_level_row.monster_cnt=2*level_i;
      if(add_level_row.monster_cnt>12){
        add_level_row.monster_cnt=12;
      }
      this_obj.stage_arr.push(add_level_row);
    }
  }
}
export default StageListData;