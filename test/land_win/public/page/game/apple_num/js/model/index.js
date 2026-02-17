import Lobby from './lobby/index.js';
import Option from './option/index.js';
import Game from './game/index.js';
import History from './history/index.js';
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
    screen: 'intro', // intro, menu, game, record, setting
    close_url:"/page/game/amenu",
    map: { x: 7, y: 8 },
    limit_sec: 60,
    is_game_sound: localStorage.getItem('apple_num_is_game_sound') !== 'false',
    is_background_sound: localStorage.getItem('apple_num_is_background_sound') !== 'false',
    sound_volume: parseFloat(localStorage.getItem('apple_num_sound_volume')) || 0.5,
    bgm_volume: parseFloat(localStorage.getItem('apple_num_bgm_volume')) || 0.5,
    name: '',
    correct: 0,
    score: 0,
    time_sec: 0,
    last_rank:0,
    game_start_time_obj: null,
    game_score_list: [],
    score_list_opt:{
      now_page:1,
      num_per_page:6,
      order_id:"a_score DESC",
      s_par_id:"apple_num",
      s_date_type:"a_date",
      s_start_date:"",
      s_end_date:"",
      s_user_name:"",
      list_sort:"rank",
      list_my_score:"",
    },
    score_count_info:{tot:0},
    default_score_row: {
      name: '',
      correct: 0,
      score: 0,
      time_sec: 0,
      date: '0000-00-00 00:00:00',
    },
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
      url:null,
    },
    img: {
      //apple_ico:null,
    },
    sound: null,
  };
  constructor(main) {
    this.main = main;
    this.data.object.lobby = new Lobby(main);
    this.data.object.option = new Option(main);
    this.data.object.game = new Game(main);
    this.data.object.history = new History(main);
  }
  init() {
    let this_obj = this;
    let main = this.main;
    this.data.html.app = document.getElementById('app');
    this.data.html.res_div = document.getElementById('res_div');
    new Util({ main: main });
    new Resource({ main: main });
    this.main.model.data.sound = new Sound({ main: main });
    this.data.name = localStorage.getItem("apple_num_user_name") || "";
    //url데이터로 초기화
    let params = this.data.util.url.get_location_params(location);
    if(params.get("close_url")){
      this.data.close_url = params.get("close_url");
    }
    if(params.get("name")){
      this.data.name = decodeURIComponent(params.get("name"));
    }
    main.model.data.score_list_opt.s_start_date=main.model.data.util.date.get_date_format(new Date(),"Y-m-01");
    main.model.data.score_list_opt.s_end_date=main.model.data.util.date.get_date_format(new Date(),"Y-m-t");
    this_obj.history.getScoreListAtServer();
  }
  get lobby() {
    return this.data.object.lobby;
  }
  get option() {
    return this.data.object.option;
  }
  get game() {
    return this.data.object.game;
  }
  get history() {
    return this.data.object.history;
  }
  setScreen(screen) {
    this.data.screen = screen;
  }
}
export default Model;