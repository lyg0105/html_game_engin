import TestChatIo from './chat/test_chat/index.js';
import TestMoveTestIo from './move/move_test/index.js';

class IoMain{
  io;
  constructor(io) {
    this.io = io;
    let this_obj = this;
    this.io.on('connection', (socket) => {
      console.log('a user connected');
      new TestChatIo(this_obj.io, socket);
      new TestMoveTestIo(this_obj.io, socket);
    });
  }
}
export default IoMain;