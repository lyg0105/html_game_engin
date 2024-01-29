class MakeCanvas
{
  static make(wrap_id){
    let canvas_wrap=document.getElementById(wrap_id);
    let screen_w=canvas_wrap.offsetWidth;
    let screen_h=canvas_wrap.offsetHeight;
    let canvas=document.createElement("canvas");
    canvas.id="canvas";
    canvas.width=screen_w;
    canvas.height=screen_h;
    canvas.style.width=screen_w+"px";
    canvas.style.height=screen_h+"px";
    canvas_wrap.appendChild(canvas);
    return canvas;
  }
}