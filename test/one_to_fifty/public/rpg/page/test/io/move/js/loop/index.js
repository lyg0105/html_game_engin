class LoopMain
{
  main=null;
  loop_interval=null;
  constructor(main) {
    this.main = main;
    this.init();
  }
  init() {
    
  }
  start(){
    let this_obj = this;
    this.loop_interval = setInterval(() => {
      this.loop();
    }, this_obj.main.data.loop_frame); // 30 FPS
  }
  loop(){
    let this_obj = this;
    this.main.controll.update();
    this.main.draw.draw();
    if(this_obj.main.data.is_host){
      this_obj.main.data.socket.emit('move_test', {
        unit_json: this_obj.main.data.unit_json
      });
    }
  }
}
export default LoopMain;