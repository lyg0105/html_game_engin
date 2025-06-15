class GameControll {
  main = null;
  constructor(main) {
    this.main = main;
    this.init();
  }
  init() {
    let this_obj = this;
    this_obj.main.data.socket.emit('move_test_init', "Hello from the client!");
    this_obj.main.data.socket.on('move_test_init', (msg) => {
      console.log(msg);
    });
  }
  add_player() {
    let this_obj = this;
    let player_num = 0;
    for (let key in this_obj.main.data.unit_json) {
      if (this_obj.main.data.unit_json[key].type == "player") {
        player_num++;
      }
    }
    player_num++;
    this_obj.main.data.select_unit_id = "p" + player_num+"."+this_obj.main.data.socket.id;
    let player = {
      ...this_obj.main.unit.default_unit,
      id: this_obj.main.data.select_unit_id,
      name: "Player " + player_num,
      x: 100,
      y: 100,
      direction: "down",
      type: "player",
    };
    this_obj.main.data.unit_json[player.id] = player;
    if (this_obj.main.data.is_host == false) {
      this_obj.main.data.socket.emit('update_unit_json', {
        [player.id]: player
      });
    }
  }
  add_enemy(){
    let this_obj = this;
    if (this_obj.main.data.is_host == false) {
      return false;
    }
    //적이 30마리 이하면 적을 추가한다.
    let main= this_obj.main;
    let enemy_num = 0;
    for (let key in this_obj.main.data.unit_json) {
      if (this_obj.main.data.unit_json[key].type == "monster") {
        enemy_num++;
      }
    }
    if (enemy_num < 50) {
      let create_x=main.MyMath.random(0,main.map.data.w);
      let create_y=main.MyMath.random(0,main.map.data.h);
      let enemy = {
        ...this_obj.main.unit.default_unit,
        id: "e" + (enemy_num + 30),
        name: "Enemy " + (enemy_num + 1),
        x: create_x,
        y: create_y,
        direction: "down",
        type: "monster",
        target_xy: {x:create_x,y:create_y},
      };
      this_obj.main.data.unit_json[enemy.id] = enemy;
      if (this_obj.main.data.is_host == false) {
        this_obj.main.data.socket.emit('update_unit_json', {
          [enemy.id]: enemy
        });
      }
    }
  }
  update() {
    let this_obj = this;
    this_obj.main.unit.update_frame();
    this_obj.main.unit.controll();
    this_obj.main.map.controll();
    this_obj.add_enemy();
  }
}
export default GameControll;