class GameMain
{
  canvas=null;
  control=null;
  map=null;
  game_loop=null;

  init(){
    let canvas_wrap=document.getElementById("canvas_wrap");
    let screen_w = canvas_wrap.offsetWidth;
    let screen_h = canvas_wrap.offsetHeight;
    this.canvas = MakeCanvas.make("canvas_wrap");
    const ctx = this.canvas.getContext("2d");
    this.map = new Map(2000, 2000, screen_w, screen_h, ctx);
    this.map.draw();

    this.control=new Controler();
    this.control.init();

    this.game_loop=new GameLoop();
    this.game_loop.init(this);
  }
}