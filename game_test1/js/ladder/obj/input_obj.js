class LygLadderGameInputObj
{
  static add_input_obj(in_opt_obj){
    if(in_opt_obj==undefined){in_opt_obj={};}
    var btn_opt_obj={
      ladder:null,
      x:0,
      y:0,
      target_id:"",
      target_idx:0,
      value:"",
      on_change:function(){
        console.log("Change");
      }
    };
    for(let key in in_opt_obj){
      btn_opt_obj[key]=in_opt_obj[key];
    }
    btn_opt_obj["target_idx"]=parseInt(btn_opt_obj["target_idx"]);
    var this_obj=btn_opt_obj.ladder;
    var this_input_obj=this;
    this.remmove_input_obj({ladder:this_obj});
    var input_obj=document.createElement("INPUT");
    this_obj.opt.canvas_obj.parentElement.appendChild(input_obj);
    input_obj.type="text";
    input_obj.id="lyg_ladder_input";
    input_obj.style.width="80px";
    input_obj.style.height="22px";
    input_obj.style.border="0px";
    input_obj.style.textAlign="center";
    input_obj.style.position="absolute";
    input_obj.style.left=btn_opt_obj.x+"px";
    input_obj.style.top=btn_opt_obj.y+"px";
    input_obj.style.opacity=0.5;
    input_obj.target_id=btn_opt_obj.target_id;
    input_obj.target_idx=btn_opt_obj.target_idx;
    input_obj.value=btn_opt_obj.value;
    input_obj.focus();
    this_obj.page_data.input_obj=input_obj;

    input_obj.onkeydown=function(e){
      if(e.keyCode==9){
        return false;
      }
    }
    input_obj.onblur=function(){
      if(this_obj.page_data.input_obj!=null){
        if(this_obj.opt[btn_opt_obj["target_id"]]){
          this_obj.opt[btn_opt_obj["target_id"]][btn_opt_obj["target_idx"]]=input_obj.value;
          this_obj.set_result();
        }
        this_input_obj.remmove_input_obj({ladder:this_obj});
        btn_opt_obj.on_change();
      }
    }
    input_obj.onkeyup=function(e){
      btn_opt_obj.on_change();
      if(e.keyCode==13||e.keyCode==9){
        console.log("Next");
      }
    }
  }
  static remmove_input_obj(in_opt_obj){
    if(in_opt_obj==undefined){in_opt_obj={};}
    let opt_obj={
      ladder:null
    };
    for(let key in in_opt_obj){
      opt_obj[key]=in_opt_obj[key];
    }
    opt_obj.ladder.page_data.input_obj=null;
    if(document.getElementById("lyg_ladder_input")){
      document.getElementById("lyg_ladder_input").remove();
    }
  }
}
export default LygLadderGameInputObj;