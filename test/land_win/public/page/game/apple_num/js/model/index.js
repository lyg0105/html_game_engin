import Lobby from './lobby/index.js';
import Option from './option/index.js';
import Game from './game/index.js';
import History from './history/index.js';

class Model{
  main;
  data={
    canvas: {
      width: 800,
      height: 600
    },
    screen: 'menu', // menu, game, record, setting
    map:{x:20,y:10},
    limit_sec:60,
    is_game_sound:true,
    is_background_sound:true,
    score:0,
    time_sec:0,
    game_start_time_obj:null,
    game_score_list:[],
    default_score_row:{
      name:'',
      score:0,
      time_sec:0,
      date:'0000-00-00 00:00:00',
    },
    html:{
      app:null,
      canvas:null,
      ctx:null,
    },
    object:{
      lobby:null,
      option:null,
      game:null,
      history:null,
    },
    util:{},
  };
  constructor(main){
    this.main = main;
    this.data.object.lobby = new Lobby(main);
    this.data.object.option = new Option(main);
    this.data.object.game = new Game(main);
    this.data.object.history = new History(main);
  }
  init(){
    this.data.html.app = document.getElementById('app');
  }
  get lobby(){
    return this.data.object.lobby;
  }
  get option(){
    return this.data.object.option;
  }
  get game(){
    return this.data.object.game;
  }
  get history(){
    return this.data.object.history;
  }
  setScreen(screen){
    this.data.screen = screen;
  }
}
export default Model;