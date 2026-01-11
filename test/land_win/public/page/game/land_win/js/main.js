import GameChat from "./chat/chat.js";
import GameMain from "./game/main.js";

class LandGame{
  io=null;
  game_body=null;
  gameMain=null;
  gameChat=null;
  client_info={};
  Myconstant={};
  socket=null;
  user_data={
    "room_id": "public",
    "user_name": "",
    "user_seq": "",
  };
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
    let this_obj=this;
    let cors_opt={
      cors: {
        origin: "*",
      },
      secure: true
    };
    this.socket = this.io(this.Myconstant.chat_url,cors_opt);
    this.user_data={
      "room_id": "public",
      "user_name": this.client_info["user_name"],
      "user_seq":this.client_info["user_seq"],
    };
    this_obj.socket.emit("set_user_data",this.user_data);

    // this.gameChat=new GameChat({
    //   io:this.io,
    //   game_body:this.game_body,
    //   client_info:this.client_info,
    //   Myconstant:this.Myconstant,
    //   socket:this.socket,
    //   user_data:this.user_data,
    // });
    // this.gameChat.start();
    this.gameMain=new GameMain({
      io:this.io,
      game_body:this.game_body,
      client_info:this.client_info,
      Myconstant:this.Myconstant,
      socket:this.socket,
      user_data:this.user_data,
    });
  }
}
export default LandGame;