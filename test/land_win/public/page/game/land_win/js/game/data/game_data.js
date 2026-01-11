import ChatObject from "./chat/index.js";

class GameData {
  main = null;
  screen = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    speed: 10,
  };
  canvas = {
    class: null,
    obj: null,
    width: 0,
    height: 0,
  };
  map = {
    width: 0,
    height: 0,
    cell_size: 1000,
    cell_width: 60,
    cell_height: 60,
  };
  chat = null;
  event = null;
  control = null;
  units = {};//build,unit {"1":{id:0,x:0,y:0,sort:'build'},...}
  player_units = [];//id arr [1,2,3..]
  selected_cells = [];
  buttons = [];//[{}]
  epects = [];
  actions = [];
  func = {
    collisionFunc: null,
    stringFunc: null,
    cellFunc: null,
  };
  constructor(inData) {
    let opt_obj = {
      main: null,
      ...inData
    };
    this.main = opt_obj.main;
    this.chat = new ChatObject({
      main: opt_obj.main,
    });
  }
};

export default GameData;