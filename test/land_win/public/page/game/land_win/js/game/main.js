import GameData from "./data/game_data.js";
import CanvasMain from "./canvas/index.js";

class GameMain {
    io = null;
    game_body = null;
    Myconstant = {};
    client_info = {};
    socket = null;
    user_data = {
        "room_id": "public",
        "user_name": "",
        "user_seq": "",
    };
    game_data={};
    constructor(inData) {
        let opt_obj = {
            io: null,
            game_body: null,
            client_info: {},
            Myconstant: {},
            ...inData
        };
        this.io = opt_obj.io;
        this.game_body = opt_obj.game_body;
        this.client_info = opt_obj.client_info;
        this.Myconstant = opt_obj.Myconstant;
        this.socket = opt_obj.socket;
        this.user_data = opt_obj.user_data;
        this.init();
    }
    init() {
        console.log('GameMain init');
        this.game_data = new GameData();
        this.game_data.canvas.class=new CanvasMain({
            game_data:this.game_data,
            game_body:this.game_body,
        });
    }
}
export default GameMain;