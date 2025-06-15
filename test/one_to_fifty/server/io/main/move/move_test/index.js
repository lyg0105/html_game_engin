class TestMoveTestIo {
  io;
  socket;
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
    let this_obj = this;
    this_obj.socket.on('move_test', (msg) => {
      this_obj.io.emit('move_test', msg);
    });
    this_obj.socket.on('update_unit_json', (msg) => {
      this_obj.io.emit('update_unit_json', msg);
    });
  }
}
export default TestMoveTestIo;