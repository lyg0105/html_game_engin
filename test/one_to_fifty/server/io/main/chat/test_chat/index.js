class TestChatIo {
  io;
  socket;
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
    let this_obj = this;
    this_obj.socket.on('chat message', (msg) => {
      this_obj.io.emit('chat message', msg);
    });
  }
}
export default TestChatIo;