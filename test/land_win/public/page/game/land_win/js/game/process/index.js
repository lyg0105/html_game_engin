class ProcessMain
{
  game_data={};
  data={
    loop_wait:50,
  };
  loop=null;
  constructor(inData)
  {
    let opt_obj={
      game_data:{},
      ...inData
    };
    this.game_data=opt_obj.game_data;
    this.init();
  }
  init()
  {
    let this_obj=this;
  }
  start()
  {
    let this_obj=this;
    this.loop=setInterval(()=>{
      this_obj.game_data.control.action();
      this_obj.game_data.canvas.class.draw();
    },this.data.loop_wait);
  }
}
export default ProcessMain;