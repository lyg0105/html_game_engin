class LygLadderButton{
  opt={
    x:0,
    y:0,
    width:100,
    height:22,
    type:"button",//text,button,custom_button
    text:"",
    background_color:"yellow",
    font:"14px Arial",
    font_style:"black",
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
    //배경
    ctx.fillStyle=this.opt.background_color;
    ctx.fillRect(this.opt.x,this.opt.y,this.opt.width,this.opt.height);
    ctx.restore();
    //텍스트
    ctx.font=this.opt.font;
    ctx.fillStyle=this.opt.font_style;
    ctx.textAlign="center";
    let text_x=this.opt.x+this.opt.width/2;
    ctx.fillText(this.opt.text,text_x,this.opt.y+this.opt.height/2+5);
    ctx.restore();
  }
  is_enter_mouse(x,y){
    if(x>=this.opt.x&&x<=this.opt.x+this.opt.width){
      if(y>=this.opt.y&&y<=this.opt.y+this.opt.height){
        return true;
      }
    }
    return false;
  }

}
export default LygLadderButton;