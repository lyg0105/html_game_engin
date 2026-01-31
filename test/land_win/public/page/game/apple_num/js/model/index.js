import Lobby from './lobby/index.js';
import Option from './option/index.js';
import Game from './game/index.js';
import History from './history/index.js';
import Util from './util/index.js';
import Resource from "./res/index.js";

class Model{
  main;
  data={
    canvas: {
      width: 800,
      height: 600
    },
    screen: 'menu', // menu, game, record, setting
    map:{x:10,y:10},
    limit_sec:30,
    is_game_sound:true,
    is_background_sound:true,
    correct:0,
    score:0,
    time_sec:0,
    game_start_time_obj:null,
    game_score_list:[],
    default_score_row:{
      name:'',
      correct:0,
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
    util:{
      fetch:null,
      string:null,
      date:null,
    },
    img:{
      apple:null,
    },
  };
  constructor(main){
    this.main = main;
    this.data.object.lobby = new Lobby(main);
    this.data.object.option = new Option(main);
    this.data.object.game = new Game(main);
    this.data.object.history = new History(main);
  }
  init(){
    let this_obj = this;
    let main=this.main;
    this.data.html.app = document.getElementById('app');
    new Util({main:main});
    new Resource({main:main});
    this_obj.history.getScoreListAtServer();
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