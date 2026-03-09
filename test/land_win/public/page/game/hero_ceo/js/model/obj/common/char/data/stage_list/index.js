class StageListData {
  default_stage = {
    id: "",
    name: "",
    x:0,
    y:0,
    monster_list:[],
    
  };
  
  constructor() {
    let this_obj = this;
    this_obj.init();
  }
  init() {
    let this_obj = this;
    let main=this_obj.main;
  }
}
export default StageListData;