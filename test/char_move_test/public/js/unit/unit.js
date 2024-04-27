class Unit
{
  data={
    x:100,
    y:100,
    w:30,
    h:30,
    speed:4,
    deg:0,
    color:"green",
    is_move:false,
    name:"",
    is_select:false,
  };
  constructor(inData){
    let opt_obj={
      data:{},
      ...inData
    };
    let this_obj=this;
    this.data={
      ...this_obj.data,
      ...opt_obj.data
    };
  }
  move(inData){
    let opt_obj={
      control:null,
      map:null,
      ...inData
    };
    let control=opt_obj.control;
    let map=opt_obj.map;
    if(control["left"]||control["right"]||control["up"]||control["down"]){
      this.data.is_move=true;
    }else{
      this.data.is_move=false;
    }
    if(this.data.is_move==false){
      return false;
    }
    if(control["left"]){
      this.data.x-=this.data.speed;
    }else if(control["right"]){
      this.data.x+=this.data.speed;
    }
    if(control["up"]){
      this.data.y-=this.data.speed;
    }else if(control["down"]){
      this.data.y+=this.data.speed;
    }

    let view_x=this.data.x-this.data.w/2;
    let view_y=this.data.y-this.data.h/2;
    let view_x2=this.data.x+this.data.w/2;
    let view_y2=this.data.y+this.data.h/2;
    if(view_x<0){
      this.data.x=this.data.w/2;
    }
    if(view_y<0){
      this.data.y=this.data.h/2;
    }

    if(view_x2>map.data.w){
      this.data.x=map.data.w-this.data.w/2;
    }
    if(view_y2>map.data.h){
      this.data.y=map.data.h-this.data.h/2;
    }

    if(this.data.is_select){
      map.move_center_xy(this.data.x,this.data.y);
    }
  }
  draw(inData){
    let opt_obj={
      ctx:null,
      map:null,
      ...inData
    };
    let ctx=opt_obj.ctx;
    let map=opt_obj.map;
    let this_obj=this;

    //그리기
    let draw_x=this.data.x+map.screen.x;
    draw_x-=this.data.w/2;
    let draw_y=this.data.y+map.screen.y;
    draw_y-=this.data.h/2;

    ctx.beginPath();
    ctx.rect(
      draw_x,
      draw_y,
      this.data.w,
      this.data.h
    );
    ctx.fillStyle = this.data.color;
    ctx.fill();
  }
}