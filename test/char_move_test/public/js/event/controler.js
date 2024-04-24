class Controler
{
  key_state={

  };
  control={
    "up":false,
    "down":false,
    "left":false,
    "right":false,
    "degree":0,
    "map_up":false,
    "map_down":false,
    "map_left":false,
    "map_right":false,
  };
  key_control_json={
    87:"map_up",
    65:"map_left",
    68:"map_right",
    83:"map_down",
    38:"up",
    40:"down",
    37:"left",
    39:"right",
  };
  constructor(){
    
  }
  init(){
    let body_obj=document.getElementsByTagName("BODY")[0];
    let this_obj=this;
    body_obj.addEventListener("keydown", (e)=>{
      this_obj.down(e.keyCode);
    });
    body_obj.addEventListener("keyup", (e)=>{
      this_obj.up(e.keyCode);
    });
  }
  up(key_code){
    this.key_state[key_code]=false;
    this.on_change_key();
  }
  down(key_code){
    this.key_state[key_code]=true;
    this.on_change_key();
  }
  all_up(){
    for(let key in this.this.key_state){
      this.key_state[key]=false;
    }
    this.on_change_key();
  }
  on_change_key=()=>{
    for(let key in this.key_control_json){
      let key_str=this.key_control_json[key];
      if(this.key_state[key]!=undefined){
        this.control[key_str]=this.key_state[key];
      }
    }
  };
}