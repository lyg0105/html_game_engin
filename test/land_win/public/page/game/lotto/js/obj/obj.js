class ObjData{
  main=null;
  constructor(inData){
    let opt_obj={
      main:null,
      ...inData
    };
    this.main=opt_obj.main;
  }
  btn_objs={
    lotto_btn:null,
    remove_all_btn:null,
    auto_add_btn:null,
    auto_add_stop_btn:null,
  };
  layout_objs={
    lotto_list:null,
  };
  input_objs={
    match_num1:null,
    match_num2:null,
    match_num3:null,
    match_num4:null,
    match_num5:null,
    match_num6:null,
  };
  text_objs={
    total_span:null,
  };
  init(){
    this.btn_objs.lotto_btn=document.getElementById("lotto_btn");
    this.btn_objs.remove_all_btn=document.getElementById("remove_all_btn");
    this.btn_objs.auto_add_btn=document.getElementById("auto_add_btn");
    this.btn_objs.auto_add_stop_btn=document.getElementById("auto_add_stop_btn");
    this.layout_objs.lotto_list=document.getElementById("lotto_list");

    this.input_objs.match_num1=document.getElementById("match_num1");
    this.input_objs.match_num2=document.getElementById("match_num2");
    this.input_objs.match_num3=document.getElementById("match_num3");
    this.input_objs.match_num4=document.getElementById("match_num4");
    this.input_objs.match_num5=document.getElementById("match_num5");
    this.input_objs.match_num6=document.getElementById("match_num6");

    this.text_objs.total_span=document.getElementById("total_span");
  }
}
export default ObjData;