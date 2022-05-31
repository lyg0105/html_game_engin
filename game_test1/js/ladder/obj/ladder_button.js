class LygLadderButton{
  opt={
    map_x:0,
    map_y:0,
    x:0,
    y:0,
    width:100,
    height:22,
    type:"button",//text,button,custom_button
    text:"",
    background_color:"yellow",
    font:"14px Arial",
    font_style:"black",
    ladder_obj:null,
    target_id:"",
    target_idx:0,
    on_click:function(){
      console.log("클릭");
    }
  };
  
  constructor(in_opt_obj){
    if(in_opt_obj==undefined){in_opt_obj={};}
    for(let key in in_opt_obj){
      this.opt[key]=in_opt_obj[key];
    }
  }
  draw(ctx){
    ctx.save();
    let draw_x=this.opt.x-this.opt.map_x;
    let draw_y=this.opt.y-this.opt.map_y;
    //배경
    ctx.fillStyle=this.opt.background_color;
    ctx.fillRect(draw_x,draw_y,this.opt.width,this.opt.height);
    ctx.restore();
    //텍스트
    ctx.font=this.opt.font;
    ctx.fillStyle=this.opt.font_style;
    ctx.textAlign="center";
    let text_x=draw_x+this.opt.width/2;
    ctx.fillText(this.opt.text,text_x,draw_y+this.opt.height/2+5);
    ctx.restore();
  }
  is_enter_mouse(x,y){
    let draw_x=this.opt.x-this.opt.map_x;
    let draw_y=this.opt.y-this.opt.map_y;
    if(x>=draw_x&&x<=draw_x+this.opt.width){
      if(y>=draw_y&&y<=draw_y+this.opt.height){
        return true;
      }
    }
    return false;
  }

}
export default LygLadderButton;