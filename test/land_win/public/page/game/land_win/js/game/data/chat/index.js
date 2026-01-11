class ChatObject {
  main = null;
  io = null;
  Myconstant = {};
  socket = null;
  user_data = {
    "room_id": "public",
    "user_name": "",
    "user_seq": "",
  };
  room_users = [];
  chat_wrap={
    x:0,
    y:0,
    width:300,
    height:300,
  };
  chat_manage_box={
    x:0,
    y:0,
    width:300,
    height:35,
  };
  chat_input_box={
    x:5,
    y:5,
    width:250,
    height:25,
  };
  chat_send_button={
    x:5,
    y:5,
    width:35,
    height:25,
  };
  is_focus_input=false;

  constructor(inData) {
    let opt_obj = {
      main: null,
      io: null,
      client_info: {},
      Myconstant: {},
      socket: null,
      ...inData
    };
    let this_obj = this;
    this.main = opt_obj.main;
    let main = this_obj.main;
    this.io = main.io;
    this.client_info = main.client_info;
    this.Myconstant = main.Myconstant;
    this.socket = main.socket;
    this.user_data = main.user_data;
    this.start();
  }

  start() {
    let this_obj = this;
    this_obj.socket.emit("get_room_users", this.user_data.room_id);

    this.socket.on('get_room_users', (data) => {
      this_obj.room_users = data;
      console.log("get_room_users", data);
    });
    this.socket.on('greet', (data) => {
      //data.msg;
    });
    this.socket.on('chat_msg', (data) => {
      //data.user_name,data.msg,data.user_seq
    });
    /*
      let msg_data={
        ...this_obj.user_data,
        msg:msg_text
      };
      this_obj.socket.emit('chat_msg', msg_data);
    */
  }

  is_mounse_in_chat_area() {
    let this_obj = this;
    let main= this_obj.main;
    let click_point = { x: main.game_data.event.data.mouse_x, y: main.game_data.event.data.mouse_y };
    let is_click_chat_box=main.game_data.func.collisionFunc.check_rect_point(
    {
      x:main.game_data.chat.chat_wrap.x,
      y:main.game_data.chat.chat_wrap.y,
      width:main.game_data.chat.chat_wrap.width,
      height:main.game_data.chat.chat_wrap.height,
    }, click_point);
    return is_click_chat_box;
  }

  on_mouse_up() {
    let this_obj = this;
    let main= this_obj.main;
    let click_point = { x: main.game_data.event.data.mouse_x, y: main.game_data.event.data.mouse_y };
    let chat_input_box=main.game_data.chat.chat_input_box;
    let is_click_input_box=main.game_data.func.collisionFunc.check_rect_point(
    {
      x:chat_input_box.x,
      y:chat_input_box.y,
      width:chat_input_box.width,
      height:chat_input_box.height,
    }, click_point);
    main.game_data.chat.is_focus_input=is_click_input_box;
  }

  on_key_up(e) {
    let this_obj = this;
    let main= this_obj.main;
  }

  render() {
    let this_obj = this;
    let main= this_obj.main;
    let canvas_class = this_obj.main.game_data.canvas.class;
    let ctx=canvas_class.ctx;

    let screen= this_obj.main.game_data.screen;
    let chat_wrap=this_obj.chat_wrap;
    chat_wrap.x=screen.width - chat_wrap.width - 10;
    chat_wrap.y=screen.height - chat_wrap.height - 10;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(chat_wrap.x,chat_wrap.y,chat_wrap.width,chat_wrap.height);

    let chat_manage_box=this_obj.chat_manage_box;
    chat_manage_box.x=chat_wrap.x;
    chat_manage_box.y=chat_wrap.y + chat_wrap.height - chat_manage_box.height;
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(chat_manage_box.x,chat_manage_box.y,chat_manage_box.width,chat_manage_box.height);

    let chat_input_box=this_obj.chat_input_box;;
    chat_input_box.x=chat_manage_box.x+5;
    chat_input_box.y=chat_manage_box.y;
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fillRect(chat_input_box.x,chat_input_box.y,chat_input_box.width,chat_input_box.height);

    let chat_send_button=this_obj.chat_send_button;
    chat_send_button.x=chat_input_box.x + chat_input_box.width+1;
    chat_send_button.y=chat_manage_box.y;
    ctx.fillStyle = "rgba(0,150,255,1)";
    ctx.fillRect(chat_send_button.x,chat_send_button.y,chat_send_button.width,chat_send_button.height);


  }
};

export default ChatObject;