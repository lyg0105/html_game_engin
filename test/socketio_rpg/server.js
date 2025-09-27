import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static("public"));

const TICK_RATE = 30; // server tick per second
const WORLD = { width: 2000, height: 2000 };

// In-memory player state
const players = new Map(); // socketId -> {id, name, x, y, dir, color, ts}
const colors = ["#e74c3c","#9b59b6","#3498db","#16a085","#f1c40f","#e67e22","#2ecc71","#1abc9c","#2c3e50","#95a5a6"];

function randomSpawn() {
  return {
    x: Math.floor(Math.random() * WORLD.width),
    y: Math.floor(Math.random() * WORLD.height)
  };
}

io.on("connection", (socket) => {
  const spawn = randomSpawn();
  const color = colors[Math.floor(Math.random() * colors.length)];
  const name = `P${String(Math.floor(Math.random()*900)+100)}`;

  const me = { id: socket.id, name, x: spawn.x, y: spawn.y, dir: 0, color, ts: Date.now() };
  players.set(socket.id, me);

  // Send my info + world + current players
  socket.emit("hello", { me, world: WORLD, players: Array.from(players.values()) });
  // Let others know I joined
  socket.broadcast.emit("player:join", me);

  socket.on("player:move", (data) => {
    const p = players.get(socket.id);
    if (!p) return;
    // basic validation and bounds clamp
    if (typeof data?.x === "number" && typeof data?.y === "number") {
      p.x = Math.max(0, Math.min(WORLD.width, data.x));
      p.y = Math.max(0, Math.min(WORLD.height, data.y));
    }
    if (typeof data?.dir === "number") p.dir = data.dir;
    p.ts = Date.now();
  });

  socket.on("player:rename", (newName) => {
    const p = players.get(socket.id);
    if (!p) return;
    if (typeof newName === "string" && newName.trim().length && newName.length <= 16) {
      p.name = newName.trim();
      io.emit("player:update", { id: p.id, name: p.name });
    }
  });

  socket.on("disconnect", () => {
    players.delete(socket.id);
    socket.broadcast.emit("player:leave", socket.id);
  });
});

// Broadcast world state at tick rate (simple approach)
setInterval(() => {
  const snapshot = Array.from(players.values());
  io.emit("world:state", snapshot);
}, 1000 / TICK_RATE);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});