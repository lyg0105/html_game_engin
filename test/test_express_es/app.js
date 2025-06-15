import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import {Server} from "socket.io";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const __filename = fileURLToPath(import.meta.url); 

const app = express();
app.use(express.static(path.join(__dirname, './public')));

var server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
  console.log('a user connected');
});

let port=8080;
server.listen(port);
console.log("Open Port:"+port);
