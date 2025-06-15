import GameData from "./data/index.js";
import DrawMain from "./draw/index.js";
import GameControll from "./controll/index.js";
import EventMain from "./event/index.js";
import Unit from "./unit/unit.js";
import LoopMain from "./loop/index.js";
import Map from "./map/map.js";
import MyMath from "./lib/my_math.js";

class Main {
  data = { ...GameData.data };
  draw = null;
  map = null;
  controll = null;
  event = null;
  unit = null;
  loop = null;
  MyMath = MyMath;
  constructor(inData) {
    let this_obj = this;
    this.data = {
      ...this_obj.data,
      socket: null,
      ...inData
    };
    this.init();
  }

  init() {
    let this_obj = this;
    this.draw = new DrawMain(this);
    this.map=new Map(this);
    this.controll = new GameControll(this);
    this.event = new EventMain(this);
    this.unit = new Unit(this);
    this.loop = new LoopMain(this);

    this.data.host_check_time_out = setTimeout(() => {
      this_obj.data.is_host = true;
    }, 1000);
    this.data.socket.on('move_test', (msg) => {
      clearTimeout(this_obj.data.host_check_time_out);
      if (this_obj.data.is_host == false) {
        this_obj.data.unit_json = msg.unit_json;
        this_obj.data.host_check_time_out = setTimeout(() => {
          this_obj.data.is_host = true;
        }, 2000);
      } else {
        this_obj.data.host_check_time_out = setTimeout(() => {
          this_obj.data.is_host = true;
        }, 1000);
      }
    });
    this.data.socket.on('update_unit_json', (msg) => {
      for(let key in msg){
        if (this_obj.data.unit_json[key]) {
          this_obj.data.unit_json[key] = {
            ...this_obj.data.unit_json[key],
            ...msg[key]
          };
        }else{
          this_obj.data.unit_json[key] = msg[key];
        }
      }
    });

    setTimeout(() => {
      this_obj.controll.add_player();
    }, 2000);

    this.loop.start();
  }
}
export default Main;