class ChatIo {
  io;
  socket;
  default_user_data={
    "room_id": "public",
    "user_name": "",
    "user_seq": "",
    "update_date_obj": new Date(),
  };
  user_data = {...this.default_user_data};
  constructor(inData) {
    let this_obj = this;
    let opt_obj = {
      io: this_obj.io,
      socket: this_obj.socket,
      user_data: this_obj.user_data,
      ...inData
    };
    this_obj.io = opt_obj.io;
    this_obj.socket = opt_obj.socket;
    this_obj.user_data = {
      ...this_obj.default_user_data,
      ...opt_obj.user_data,
    };
  }
  init() {
    let this_obj = this;
    let socket = this_obj.socket;

    //정보세팅
    socket.on('set_user_data', async (inData) => {
      let optObj = {
        "room_id": "public",
        "user_name": "",
        "user_seq": "",
        "update_date_obj": new Date(),
        ...inData
      };
      socket.user_data = optObj;
      this_obj.user_data = optObj;
      //방접속
      socket.join(socket.user_data.room_id);
      //로그인메세지전송
      this_obj.io.to(socket.user_data.room_id).emit('greet', {
        "msg": socket.user_data.user_name + "님이 접속하였습니다."
      });
    });

    //방접속자얻기
    socket.on('get_room_users', async (inOptObj) => {
      let opt_obj = {
        "room_id": "",
        ...inOptObj
      };
      let room_id = opt_obj.room_id;
      if (room_id == "") {
        if (socket.user_data) {
          room_id = socket.user_data.room_id;
        }
      }
      if (room_id) {
        let room_user_data_arr = await this_obj.get_room_users_by_comp_room_id(room_id);
        this_obj.io.to(room_id).emit("get_room_users", room_user_data_arr);
      }
    });

    socket.on('chat_msg', (data) => {
      console.log('message: ' + data.msg);
      this_obj.io.emit('chat_msg', data);
    });
  }
}
module.exports = ChatIo;