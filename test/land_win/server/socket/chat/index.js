const { Server } = require('socket.io');
const ChatIo = require('./chat');

class ChatSocketClass {
  io = null;
  async init(inData) {
    let opt_obj = {
      server: null,
      ...inData
    };
    let this_obj = this;
    this.server = opt_obj.server;
    this.io = new Server(this.server, {
      cors: {
        //origin: global.PrjChatConstant.ALLOW_SERVER_URL,
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log('a user connected');

      let chatIo = new ChatIo({
        io: this_obj.io,
        socket: socket,
      });
      chatIo.init();

      socket.on('draw', (inData) => {
        // console.log("draw_line");
        this_obj.io.emit('draw', inData);
      });

      socket.on('disconnect', async () => {
        if (socket.user_data) {
          let room_user_data_arr = await this_obj.get_room_users_by_comp_room_id(socket.user_data.room_id);
          this_obj.io.to(socket.user_data.comp_room_id).emit("get_room_users", room_user_data_arr);
        }
        console.log('user disconnected');
      });
    });
  }

  async get_room_users_by_comp_room_id(room_id) {
    let room_user_data_arr = [];
    if (room_id) {
      const sockets = await this.io.in(room_id).fetchSockets();
      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i].user_data) {
          room_user_data_arr.push(sockets[i].user_data);
        }
      }
    }
    return room_user_data_arr;
  }
}
module.exports = ChatSocketClass