// socket.js
const WebSocket = require('ws');

module.exports = (server) => {
  const wss = new WebSocket.Server({ server }); // 익스프레스 서버와 웹 소켓 서버 연결

  wss.on('connection', (ws, req) => { // 클라이언트가 서버와 웹소켓 연결 시 발생하는 이벤트
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // 클라이언트의 IP
    console.log('새로운 클라이언트 접속', ip);
    ws.send('새로운 클라이언트 접속');
    
    ws.on('message', (message) => { // 클라이언트로부터 메시지가 왔을 때
      console.log(message);
    });
    ws.on('error', (error) => { // 웹 소켓 연결 중 문제가 생겼을 때
      console.error(error);
    });
    ws.on('close', () => { // 클라이언트와 연결이 끊겼을 때
      console.log('클라이언트 접속 해제', ip);
      clearInterval(ws.interval); // interval 정리
    });

    ws.interval = setInterval(() => { // 3초마다 연결된 모든 클라이언트에게 메시지 전송
      if (ws.readyState === ws.OPEN) { // 상태가 OPEN일 경우 메세지 전송
        ws.send('No HanGle?? H. 한글은 안되나??');
      }
    }, 3000);
  });
};