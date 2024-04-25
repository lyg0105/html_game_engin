class Map
{
  ctx=null;
  data={
    w:1000,
    h:1000,
    color:"black",
    move_speed:10,
  };
  screen={
    x:0,
    y:0,
    w:100,
    h:100,
  };
  constructor(w,h,sw,sh,ctx){
    this.data.w=w;
    this.data.h=h;
    this.screen.w=sw;
    this.screen.h=sh;
    this.ctx=ctx;
  }
  set_screen(x,y){
    this.screen.x=x;
    this.screen.y=y;
  }
  move(control){
    if(control["map_left"]){
      this.screen.x-=this.data.move_speed;
    }else if(control["map_right"]){
      this.screen.x+=this.data.move_speed;
    }
    if(control["map_up"]){
      this.screen.y-=this.data.move_speed;
    }else if(control["map_down"]){
      this.screen.y+=this.data.move_speed;
    }
    if(this.screen.x>0){
      this.screen.x=0;
    }
    if(this.screen.y>0){
      this.screen.y=0;
    }
    let min_x=this.screen.w-this.data.w;
    let min_y=this.screen.h-this.data.h;
    if(this.screen.x<min_x){
      this.screen.x=min_x;
    }
    if(this.screen.y<min_y){
      this.screen.y=min_y;
    }
  }
  draw(){
    let ctx=this.ctx;
    let this_obj=this;

    //스크린그리기
    ctx.beginPath();
    ctx.rect(
      0,
      0,
      this_obj.screen.w,
      this_obj.screen.h
    );
    ctx.fillStyle = "black";
    ctx.fill();

    //맵그리기
    this.draw_back_img();
  }
  draw_back_img(){
    let ctx=this.ctx;
    let this_obj=this;

    ctx.beginPath();
    const img = document.getElementById("back_img1");
    ctx.drawImage(img,
      this_obj.screen.x,
      this_obj.screen.y,
      this_obj.data.w,
      this_obj.data.h,
    );
  }
}