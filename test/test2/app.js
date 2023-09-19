const express = require('express');
const app = express();
const port=3000;
const http = require('http').Server(app);
const cors = require('cors');

let corsOptions = {
  origin: '*',
  credentials: true
}

app.use(cors(corsOptions));

const webSocket = require('./socket/socket');
webSocket(http);

http.listen(port, () => console.log('listening on port ' + port));