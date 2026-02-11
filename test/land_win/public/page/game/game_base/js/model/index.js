import Util from './util/index.js';
import Resource from "./res/index.js";
import Sound from "./sound/index.js";

class Model {
  main;
  data = {
    canvas: {
      width: 800,
      height: 600
    },
    close_url:"/page/game/amenu",
    html: {
      app: null,
      canvas: null,
      ctx: null,
      res_div: null,
    },
    object: {
      lobby: null,
      option: null,
      game: null,
      history: null,
    },
    util: {
      fetch: null,
      string: null,
      date: null,
    },
    img: {
      //apple_ico:null,
    },
    sound: null,
  };
  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    this.data.html.app = document.getElementById('app');
    this.data.html.res_div = document.getElementById('res_div');
    new Util({ main: main });
    new Resource({ main: main });
    this.main.model.data.sound = new Sound({ main: main });
  }
}
export default Model;