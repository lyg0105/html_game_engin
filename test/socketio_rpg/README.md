# Socket.IO RPG Sample (HTML/CSS/JS)

A tiny multiplayer "RPG-like" sandbox that shows:
- Player spawn & movement (WASD/Arrow keys)
- Real-time sync via Socket.IO
- Name change
- Camera follow, zoom, simple grid world

## Run

```bash
cd socketio-rpg
npm i
npm start
# open http://localhost:3000
```

Open multiple browser tabs/windows to see multiplayer.

## Files

- `server.js` — Express static server + Socket.IO state loop
- `public/index.html` — Canvas + UI
- `public/client.js` — Rendering, input, socket handling
- `public/styles.css` — Minimal styles