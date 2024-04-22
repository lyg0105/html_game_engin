class GameMain
{
  canvas=null;
  controller=null;
  map=null;

  init(){
    let canvas_wrap=document.getElementById("canvas_wrap");
    let screen_w = canvas_wrap.offsetWidth;
    let screen_h = canvas_wrap.offsetHeight;
    this.canvas = MakeCanvas.make("canvas_wrap");
    const ctx = this.canvas.getContext("2d");
    this.map = new Map(2000, 2000, screen_w, screen_h, ctx);
    this.map.draw();

    this.controller=new Controler();
    this.controller.init();
  }
}