import Myconstant from "/js/env.js";
import LandGame from './main.js';
let client_info = null;
let socket = null;

function go_start_game() {
  let landGame = new LandGame({
    io: io,
    game_body: document.getElementById("game_body"),
    client_info: client_info,
    Myconstant: Myconstant,
  });
  landGame.start();
};

window.addEventListener("load", () => {
  LygLoginFunc.get_login_data();
  client_info = LygLoginFunc.login_data.client_info;
  let script_div = document.getElementById("script_div");
  const io_script = document.createElement("script");
  io_script.async = false;
  io_script.src = Myconstant.chat_url + "/socket.io/socket.io.js";
  script_div.appendChild(io_script);
  setTimeout(() => {
    go_start_game();
  }, 500);
});

export default client_info;