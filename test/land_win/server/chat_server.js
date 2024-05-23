const express = require('express');
const { createServer } = require('node:http');
var path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../public')));

const server = createServer(app);
const ChatSocketClass=require("./socket/chat");
const chat_class=new ChatSocketClass();
chat_class.init({
  server:server
});
server.listen(3002, () => {
  console.log('server running at http://localhost:3002');
});

module.exports = app;