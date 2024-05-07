const { Server } = require('socket.io');

class ChatSocketClass {
  io = null;
  init(inData) {
    let opt_obj = {
      server: null,
      ...inData
    };
    this.server = opt_obj.server;
    this.io = new Server(this.server);

    this.io.on('connection', (socket) => {
      console.log('a user connected');
      socket.broadcast.emit('hi');

      socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
      });

      socket.on('draw', (inData) => {
        // console.log("draw_line");
        io.emit('draw', inData);
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }
}
module.exports = ChatSocketClass