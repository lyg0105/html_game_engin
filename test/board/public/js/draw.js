const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const canvas=document.getElementById('canvas');
const line_width_input=document.getElementById('line_width_input');
const line_color_input=document.getElementById('line_color_input');
const clear_button=document.getElementById('clear_button');
const ctx = canvas.getContext("2d");
let default_draw_data={
  is_draw:false,
  sort:"line",
  x:0,
  y:0,
  x2:0,
  y2:0,
  width:5,
  color:"#000000",
};
let draw_data={...default_draw_data};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
    input.focus();
  }
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('draw', (inData) => {
  if(inData.sort=="line"){
    draw_line(inData);
  }else if(inData.sort=="draw_clear"){
    draw_clear(inData);
  }
});

canvas.addEventListener("mousedown",(e)=>{
  draw_data.is_draw=true;
});
canvas.addEventListener("mousemove",(e)=>{
  const x = event.offsetX;
  const y = event.offsetY;
  if(draw_data.sort=="line"){
    if(draw_data.is_draw){
      draw_data.x2=x;
      draw_data.y2=y;
      socket.emit('draw',draw_data);
      draw_data.x=x;
      draw_data.y=y;
    }else{
      draw_data.x=x;
      draw_data.y=y;
    }
  }
});
canvas.addEventListener("mouseup",(e)=>{
  draw_data.is_draw=false;
});
canvas.addEventListener("mouseleave",(e)=>{
  draw_data.is_draw=false;
});
canvas.addEventListener("touchstart",(e)=>{
  draw_data.is_draw=false;
});
canvas.addEventListener("touchmove",(e)=>{
  if(e.touches){
    const x =e.touches[0].pageX;
    const y =e.touches[0].pageY;
    if(draw_data.sort=="line"){
      if(draw_data.is_draw){
        draw_data.x2=x;
        draw_data.y2=y;
        socket.emit('draw',draw_data);
        draw_data.x=x;
        draw_data.y=y;
      }else{
        draw_data.x=x;
        draw_data.y=y;
        draw_data.is_draw=true;
      }
    }
  }
});
canvas.addEventListener("touchend",(e)=>{
  draw_data.is_draw=false;
});
line_width_input.addEventListener("change",(e)=>{
  let line_w=parseFloat(e.target.value);
  draw_data.width=line_w;
});
line_color_input.addEventListener("change",(e)=>{
  draw_data.color=e.target.value;
});
clear_button.addEventListener("click",(e)=>{
  draw_data.sort="draw_clear";
  socket.emit('draw',draw_data);
  draw_data.sort="line";
});

function draw_line(inData){
  let opt_obj={
    ...default_draw_data,
    ...inData
  };
  ctx.lineWidth = opt_obj.width;
  ctx.lineCap = "round";
  ctx.strokeStyle = opt_obj.color;
  ctx.beginPath(); 
  ctx.moveTo(opt_obj.x,opt_obj.y);
  ctx.lineTo(opt_obj.x2,opt_obj.y2); 
  ctx.stroke();
}
function draw_clear(inData){
  let opt_obj={
    ...default_draw_data,
    ...inData
  };
  ctx.clearRect(0, 0, 500, 500);
}