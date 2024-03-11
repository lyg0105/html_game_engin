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

  }
  up(key_code){
    this.key_state[key_code]=false;
  }
  down(key_code){
    this.key_state[key_code]=true;
  }
  all_up(){
    for(let key in this.this.key_state){
      this.key_state[key]=false;
    }
  }
}