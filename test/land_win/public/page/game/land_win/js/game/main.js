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
    }
}
export default GameMain;