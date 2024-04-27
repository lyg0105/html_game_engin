class GameMain
{
  canvas=null;
  control=null;
  map=null;
  ctx=null;
  game_loop=null;
  unit_arr=[];

  init(){
    let canvas_wrap=document.getElementById("canvas_wrap");
    let screen_w = canvas_wrap.offsetWidth;
    let screen_h = canvas_wrap.offsetHeight;
    this.canvas = MakeCanvas.make("canvas_wrap");
    this.ctx = this.canvas.getContext("2d");
    this.map = new Map(3000, 2000, screen_w, screen_h, this.ctx);
    this.map.draw();

    this.control=new Controler();
    this.control.init();

    this.unit_arr.push(new Unit({
      data:{
        x:100,
        y:100,
        is_select:true,
        speed:10,
      }
    }));
    //랜덤추가.
    let em_color_arr=["red","orange","black","yellow","blue"];
    for(let i=0;i<100;i++){
      let ran_color=em_color_arr[LygMath.random(0,em_color_arr.length-1)];
      let random_x=LygMath.random(50,this.map.data.w-50);
      let random_y=LygMath.random(50,this.map.data.h-50);
      this.unit_arr.push(new Unit({
        data:{
          x:random_x,
          y:random_y,
          color:ran_color,
        }
      }));
    }

    this.game_loop=new GameLoop();
    this.game_loop.init(this);
  }
}