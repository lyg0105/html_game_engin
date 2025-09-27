const socket = io();

// Camera & Input
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let zoom = 1;
let camera = { x: 0, y: 0 };
let keys = new Set();

const my = { id: null, name: "Me", color: "#ffffff", x: 0, y: 0, dir: 0 };
let world = { width: 2000, height: 2000 };
const players = new Map(); // id -> state

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// Input handling
window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  keys.add(e.key.toLowerCase());
});
window.addEventListener("keyup", (e) => {
  keys.delete(e.key.toLowerCase());
});

// Mouse wheel for zoom
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const delta = Math.sign(e.deltaY) * 0.1;
  zoom = clamp(zoom - delta, 0.5, 2.0);
}, { passive: false });

// Name input
const nameInput = document.getElementById("nameInput");
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const val = nameInput.value.trim();
    if (val) socket.emit("player:rename", val);
  }
});

// Socket events
socket.on("hello", ({ me, world: w, players: list }) => {
  Object.assign(my, me);
  world = w;
  list.forEach(p => players.set(p.id, p));
  players.set(my.id, my);
  centerCameraOn(my);
});

socket.on("player:join", (p) => {
  players.set(p.id, p);
});

socket.on("player:update", (patch) => {
  const p = players.get(patch.id);
  if (!p) return;
  Object.assign(p, patch);
});

socket.on("player:leave", (id) => {
  players.delete(id);
});

socket.on("world:state", (snapshot) => {
  snapshot.forEach(p => {
    const current = players.get(p.id);
    if (!current) {
      players.set(p.id, p);
    } else {
      // Smoothly interpolate others (except myself who is client-authoritative)
      if (p.id !== my.id) {
        current.x = lerp(current.x, p.x, 0.5);
        current.y = lerp(current.y, p.y, 0.5);
        current.dir = p.dir;
        current.name = p.name;
        current.color = p.color;
      }
    }
  });
});

function centerCameraOn(p) {
  camera.x = clamp(p.x - canvas.width / 2 / zoom, 0, world.width - canvas.width / zoom);
  camera.y = clamp(p.y - canvas.height / 2 / zoom, 0, world.height - canvas.height / zoom);
}

// Movement loop (client authoritative, server reconciles via bounds)
const SPEED = 180; // px/sec
let lastTime = performance.now();
let lastSend = 0;

function update(dt) {
  const vx = (keys.has("arrowright") || keys.has("d") ? 1 : 0) - (keys.has("arrowleft") || keys.has("a") ? 1 : 0);
  const vy = (keys.has("arrowdown")  || keys.has("s") ? 1 : 0) - (keys.has("arrowup")   || keys.has("w") ? 1 : 0);

  if (vx !== 0 || vy !== 0) {
    const len = Math.hypot(vx, vy) || 1;
    my.x = clamp(my.x + (vx/len) * SPEED * dt, 0, world.width);
    my.y = clamp(my.y + (vy/len) * SPEED * dt, 0, world.height);
    my.dir = Math.atan2(vy, vx);
    // send at 15Hz
    const now = performance.now();
    if (now - lastSend > 66) {
      socket.emit("player:move", { x: my.x, y: my.y, dir: my.dir });
      lastSend = now;
    }
  }

  // Camera follow
  centerCameraOn(my);
}

function drawGrid() {
  const grid = 100;
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  for (let x = 0; x <= world.width; x += grid) {
    const sx = (x - camera.x) * zoom;
    ctx.beginPath(); ctx.moveTo(sx, -camera.y * zoom); ctx.lineTo(sx, (world.height - camera.y) * zoom); ctx.stroke();
  }
  for (let y = 0; y <= world.height; y += grid) {
    const sy = (y - camera.y) * zoom;
    ctx.beginPath(); ctx.moveTo(-camera.x * zoom, sy); ctx.lineTo((world.width - camera.x) * zoom, sy); ctx.stroke();
  }
  ctx.restore();
}

function drawPlayer(p, isMe=false) {
  const radius = 12 * (isMe ? 1.2 : 1);
  const sx = (p.x - camera.x) * zoom;
  const sy = (p.y - camera.y) * zoom;
  ctx.save();
  // body
  ctx.beginPath();
  ctx.arc(sx, sy, radius, 0, Math.PI*2);
  ctx.fillStyle = p.color || "#aaa";
  ctx.fill();
  // direction nose
  ctx.beginPath();
  const nx = sx + Math.cos(p.dir || 0) * radius;
  const ny = sy + Math.sin(p.dir || 0) * radius;
  ctx.moveTo(sx, sy); ctx.lineTo(nx, ny);
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 2;
  ctx.stroke();
  // name
  ctx.font = `${Math.floor(12*zoom)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText(p.name || "?", sx, sy - 18*zoom);
  ctx.restore();
}

function render() {
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,canvas.width, canvas.height);

  // world background
  ctx.fillStyle = "#0b0d12";
  ctx.fillRect(0,0,canvas.width, canvas.height);

  ctx.save();
  drawGrid();
  // border
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.strokeRect((-camera.x)*zoom, (-camera.y)*zoom, world.width*zoom, world.height*zoom);

  // Draw all players
  for (const p of players.values()) {
    drawPlayer(p, p.id === my.id);
  }
  ctx.restore();
}

function loop(ts) {
  const dt = Math.min(0.05, (ts - lastTime) / 1000);
  lastTime = ts;
  update(dt);
  render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Resize handling
function fit() {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.min(window.innerWidth - 20, 1280);
  const h = Math.min(window.innerHeight - 120, 720);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener("resize", fit);
fit();