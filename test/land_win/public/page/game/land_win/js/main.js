import GameChat from "./chat/chat.js";
class LandGame{
  io=null;
  game_body=null;
  gameChat=null;
  client_info={};
  Myconstant={};
  constructor(inData){
    let opt_obj={
      io:null,
      game_body:null,
      client_info:{},
      Myconstant:{},
      ...inData
    };
    this.io=opt_obj.io;
    this.game_body=opt_obj.game_body;
    this.client_info=opt_obj.client_info;
    this.Myconstant=opt_obj.Myconstant;
  }
  start(){
    console.log("Game Start");
    this.gameChat=new GameChat({
      io:this.io,
      game_body:this.game_body,
      client_info:this.client_info,
      Myconstant:this.Myconstant,
    });
    this.gameChat.start();
  }
}
export default LandGame;