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
      socket:null,
      ...inData
    };
    let this_obj=this;
    this.io=opt_obj.io;
    this.game_body=opt_obj.game_body;
    this.client_info=opt_obj.client_info;
    this.Myconstant=opt_obj.Myconstant;
    this.socket=opt_obj.socket;
    this.user_data=opt_obj.user_data;
    this.make_element();
    this.elements.open_btn.addEventListener("click",()=>{
      let chat_wrap=this_obj.elements.chat_wrap;
      if(chat_wrap.style.display=="none"){
        chat_wrap.style.display="block";
        strFunc.set_storage("is_open_chat_box","1");
      }else{
        chat_wrap.style.display="none";
        strFunc.set_storage("is_open_chat_box","");
      }
    });
    this.elements.msg_clear_btn.addEventListener("click",()=>{
      let chat_msg_wrap=this_obj.elements.chat_msg_wrap;
      chat_msg_wrap.innerHTML="";
    });
  }
  start(){
    let this_obj=this;
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
      let user_name_color="#6c90ff";
      if(this_obj.client_info["user_seq"]==data.user_seq){
        user_name_color="#29ff29";
      }
      let u_name_style="color:"+user_name_color+";font-weight:bold;";
      let msg_row_str=
        "<div>"+
          "<span style='"+u_name_style+"' >"+data.user_name+"</span>"+
          "<span style='margin-left:3px;' >"+data.msg+"</span>"+
        "</div>";
      chat_msg_wrap.innerHTML+=msg_row_str;
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
    this.elements.chat_msg_wrap.style.flexGrow="1";
    this.elements.chat_msg_wrap.style.overflow="auto";
    this.elements.chat_msg_wrap.style.background="#000";

    //보내기박스
    this.elements.send_msg_wrap=document.createElement("div");
    this.elements.send_msg_wrap.style.borderTop="1px solid green";
    this.elements.send_msg_wrap.style.display="flex";

    this.elements.msg_input=document.createElement("input");
    this.elements.msg_input.style.width="213px";
    this.elements.msg_input.style.flexGrow="1";
    this.elements.send_msg_btn=document.createElement("button");
    this.elements.send_msg_btn.innerHTML="Send";
    this.elements.msg_clear_btn=document.createElement("button");
    this.elements.msg_clear_btn.innerHTML="Clear";
    this.elements.send_msg_wrap.appendChild(this.elements.msg_input);
    this.elements.send_msg_wrap.appendChild(this.elements.send_msg_btn);
    this.elements.send_msg_wrap.appendChild(this.elements.msg_clear_btn);

    //내용박스
    this.elements.chat_wrap_con=document.createElement("div");
    this.elements.chat_wrap_con.style.position="relative";
    this.elements.chat_wrap_con.style.display="flex";
    this.elements.chat_wrap_con.style.flexDirection="column";
    this.elements.chat_wrap_con.style.height="100%";
    this.elements.chat_wrap_con.appendChild(this.elements.chat_msg_wrap);
    this.elements.chat_wrap_con.appendChild(this.elements.send_msg_wrap);

    //채팅박스
    this.elements.chat_wrap=document.createElement("div");
    this.elements.chat_wrap.style.position="fixed";
    this.elements.chat_wrap.style.left="0px";
    this.elements.chat_wrap.style.bottom="30px";
    this.elements.chat_wrap.style.height="400px";
    this.elements.chat_wrap.style.width="300px";
    this.elements.chat_wrap.style.border="1px solid #ddd";
    this.elements.chat_wrap.style.background="#000";
    this.elements.chat_wrap.appendChild(this.elements.chat_wrap_con);

    //채팅열기버튼
    this.elements.open_btn=document.createElement("button");
    this.elements.open_btn.style.position="fixed";
    this.elements.open_btn.style.left="2px";
    this.elements.open_btn.style.bottom="2px";
    this.elements.open_btn.innerHTML="채팅";
    if(strFunc.get_storage("is_open_chat_box")=="1"){
      this.elements.chat_wrap.style.display="block";
    }else{
      this.elements.chat_wrap.style.display="none";
    }

    //body에추가
    this.game_body.appendChild(this.elements.chat_wrap);
    this.game_body.appendChild(this.elements.open_btn);
  }
}
export default GameChat;