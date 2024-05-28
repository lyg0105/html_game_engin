class GameChat{
  io=null;
  Myconstant={};
  game_body=null;
  socket=null;
  elements={
    open_btn:null,
    chat_wrap:null,
    chat_wrap_con:null,
    chat_msg_wrap:null,
    send_msg_wrap:null,
    msg_input:null,
    send_msg_btn:null,
    msg_clear_btn:null,
  };
  is_show_chat=false;
  client_info={};
  user_data={
    "room_id": "public",
    "user_name": "",
    "user_seq": "",
  };
  room_users=[];

  constructor(inData){
    let opt_obj={
      io:null,
      game_body:null,
      client_info:{},
      Myconstant:{},
      ...inData
    };
    let this_obj=this;
    this.io=opt_obj.io;
    this.game_body=opt_obj.game_body;
    this.client_info=opt_obj.client_info;
    this.Myconstant=opt_obj.Myconstant;
    this.make_element();
    this.elements.open_btn.addEventListener("click",()=>{
      let chat_wrap=this_obj.elements.chat_wrap;
      if(chat_wrap.style.display=="none"){
        chat_wrap.style.display="block";
      }else{
        chat_wrap.style.display="none";
      }
    });
    this.elements.msg_clear_btn.addEventListener("click",()=>{
      let chat_msg_wrap=this_obj.elements.chat_msg_wrap;
      chat_msg_wrap.innerHTML="";
    });
  }
  start(){
    let this_obj=this;
    let cors_opt={
      cors: {
        origin: "*",
      },
      secure: true
    };
    this.socket = this.io(this.Myconstant.chat_url,cors_opt);
    this.user_data={
      "room_id": "public",
      "user_name": this.client_info["user_name"],
      "user_seq":this.client_info["user_seq"],
    };
    this_obj.socket.emit("set_user_data",this.user_data);
    this_obj.socket.emit("get_room_users",this.user_data.room_id);

    this.socket.on('get_room_users', (data) => {
      this_obj.room_users=data;
      console.log("get_room_users",data);
    });
    this.socket.on('greet', (data) => {
      console.log("greet",data);
      let chat_msg_wrap=this_obj.elements.chat_msg_wrap;
      let msg_row=document.createElement("div");
      msg_row.innerHTML=data.msg;
      chat_msg_wrap.appendChild(msg_row);
      chat_msg_wrap.scrollTop=chat_msg_wrap.scrollHeight;
    });
    this.socket.on('chat_msg', (data) => {
      let chat_msg_wrap=this_obj.elements.chat_msg_wrap;
      let msg_row=document.createElement("div");
      msg_row.innerHTML=data.msg;
      chat_msg_wrap.appendChild(msg_row);
      chat_msg_wrap.scrollTop=chat_msg_wrap.scrollHeight;
    });
    let send_msg_btn=this_obj.elements.send_msg_btn;
    send_msg_btn.addEventListener("click",()=>{
      let msg_input=this_obj.elements.msg_input;
      let msg_data={
        ...this_obj.user_data,
        msg:msg_input.value
      };
      this_obj.socket.emit('chat_msg', msg_data);
      msg_input.value = '';
      msg_input.focus();
    });
  }
  make_element(){
    //메세지박스
    this.elements.chat_msg_wrap=document.createElement("div");
    this.elements.chat_msg_wrap.style.height="350px";
    this.elements.chat_msg_wrap.style.overflow="auto";

    //보내기박스
    this.elements.send_msg_wrap=document.createElement("div");
    this.elements.send_msg_wrap.style.borderTop="1px solid green";

    this.elements.msg_input=document.createElement("input");
    this.elements.send_msg_btn=document.createElement("button");
    this.elements.send_msg_btn.innerHTML="보내기";
    this.elements.msg_clear_btn=document.createElement("button");
    this.elements.msg_clear_btn.innerHTML="Clear";
    this.elements.send_msg_wrap.appendChild(this.elements.msg_input);
    this.elements.send_msg_wrap.appendChild(this.elements.send_msg_btn);
    this.elements.send_msg_wrap.appendChild(this.elements.msg_clear_btn);

    //내용박스
    this.elements.chat_wrap_con=document.createElement("div");
    this.elements.chat_wrap_con.style.position="relative";
    this.elements.chat_wrap_con.appendChild(this.elements.chat_msg_wrap);
    this.elements.chat_wrap_con.appendChild(this.elements.send_msg_wrap);

    //채팅박스
    this.elements.chat_wrap=document.createElement("div");
    this.elements.chat_wrap.style.position="fixed";
    this.elements.chat_wrap.style.left="0px";
    this.elements.chat_wrap.style.bottom="0px";
    this.elements.chat_wrap.style.minHeight="400px";
    this.elements.chat_wrap.style.width="300px";
    this.elements.chat_wrap.style.border="1px solid #ddd";
    this.elements.chat_wrap.appendChild(this.elements.chat_wrap_con);

    //채팅열기버튼
    this.elements.open_btn=document.createElement("button");
    this.elements.open_btn.style.position="fixed";
    this.elements.open_btn.style.left="2px";
    this.elements.open_btn.style.bottom="2px";
    this.elements.open_btn.innerHTML="채팅";

    //body에추가
    this.game_body.appendChild(this.elements.chat_wrap);
    this.game_body.appendChild(this.elements.open_btn);
  }
}
export default GameChat;