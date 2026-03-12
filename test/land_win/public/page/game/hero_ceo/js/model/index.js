import Util from './util/index.js';
import Resource from "./res/index.js";
import Sound from "./sound/index.js";
import Obj from "./obj/index.js";

class Model {
  main;
  data = {
    canvas: {
      width: 800,
      height: 600
    },
    close_url: "/page/game/amenu",
    page_state: "lobby", //lobby,option,game,history
    page_obj: null,
    game_data:{
      select_char_arr:[],
      select_stage:null,
    },
    game_option:{
      is_game_sound: localStorage.getItem('hero_ceo_is_game_sound') !== 'false',
      is_background_sound: localStorage.getItem('hero_ceo_is_background_sound') !== 'false',
      sound_volume: parseFloat(localStorage.getItem('hero_ceo_sound_volume')) || 0.5,
      bgm_volume: parseFloat(localStorage.getItem('hero_ceo_bgm_volume')) || 0.5,
    },
    html: {
      app: null,
      canvas: null,
      ctx: null,
      res_div: null,
    },
    object: {
      common:{},
      lobby: null,
      option: null,
      select_char:null,
    },
    util: {
      fetch: null,
      string: null,
      date: null,
    },
    res: {
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
    this.main.model.data.res = new Resource({ main: main });
    this.main.model.data.sound = new Sound({ main: main });

    new Obj(main);
  }
}
export default Model;