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
  };
  constructor(){
    
  }
  init(){
    let body_obj=document.getElementsByTagName("BODY")[0];
    let this_obj=this;
    body_obj.addEventListener("keydown", (e)=>{
      this_obj.up(e.keyCode);
    });
    body_obj.addEventListener("keyup", (e)=>{
      this_obj.down(e.keyCode);
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
    
  };
}