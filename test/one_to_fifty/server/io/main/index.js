var TestChatIo = require('../chat/test_chat');

class IoMain{
  io;
  constructor(io) {
    this.io = io;
    let this_obj = this;
    this.io.on('connection', (socket) => {
      console.log('a user connected');
      new TestChatIo(this_obj.io, socket);
    });
  }
}
module.exports = IoMain;