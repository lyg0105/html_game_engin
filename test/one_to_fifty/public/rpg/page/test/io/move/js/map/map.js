class Map
{
  main=null;
  data={
    w:1800,
    h:2700,
    color:"black",
    move_speed:10,
  };
  screen={
    x:0,
    y:0,
    w:100,
    h:100,
  };
  constructor(main){
    this.main=main;
    this.set_screen_size_auto();
  }
  set_screen_size_auto(){
    this.screen.w=window.innerWidth;
    this.screen.h=window.innerHeight;
  }
  controll(){
    let this_obj = this;
    this_obj.move();
  }
  move(){
    let control= this.main.event.control;
    if(control["map_left"]){
      this.screen.x+=this.data.move_speed;
    }else if(control["map_right"]){
      this.screen.x-=this.data.move_speed;
    }
    if(control["map_up"]){
      this.screen.y+=this.data.move_speed;
    }else if(control["map_down"]){
      this.screen.y-=this.data.move_speed;
    }

    this.check_min_max();
  }
  move_center_xy(center_x,center_y){
    this.screen.x=-center_x+this.screen.w/2;
    this.screen.y=-center_y+this.screen.h/2;

    this.check_min_max();
  }
  check_min_max(){
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
    let ctx=this.main.data.ctx;
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
    let ctx=this.main.data.ctx;
    let this_obj=this;

    ctx.beginPath();
    const img = this.main.data.unit_sprite_images["map"];
    if (!img) {
      console.error("Map image not loaded");
      return;
    }
    ctx.drawImage(img,
      this_obj.screen.x,
      this_obj.screen.y,
      this_obj.data.w,
      this_obj.data.h,
    );
  }
}
export default Map;