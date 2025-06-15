class ControllUnit {
  static controll_by_event(inData) {
    let opt_obj = {
      main: null,
      ...inData
    };
    let main = opt_obj.main;
    let this_obj = this;
    let select_unit = main.data.unit_json[main.data.select_unit_id];
    if (select_unit == undefined) {
      return false;
    }
    let control = main.event.control;
    if (control["left"] || control["right"] || control["up"] || control["down"]) {
      select_unit.is_move = true;
    } else {
      select_unit.is_move = false;
    }
    if (control["attact"]) {
      select_unit.is_move = false;
      select_unit.is_attack = true;
    } else {
      select_unit.is_attack = false;
    }

    if (control["left"]) {
      select_unit.direction = "left";
      select_unit.degree = 270;
    } else if (control["right"]) {
      select_unit.direction = "right";
      select_unit.degree = 90;
    } else if (control["up"]) {
      select_unit.direction = "up";
      select_unit.degree = 0;
    } else if (control["down"]) {
      select_unit.direction = "down";
      select_unit.degree = 180;
    }
    if (control["left"] && control["up"]) {
      select_unit.degree = 315;
    } else if (control["left"] && control["down"]) {
      select_unit.degree = 225;
    }
    if (control["right"] && control["up"]) {
      select_unit.degree = 45;
    } else if (control["right"] && control["down"]) {
      select_unit.degree = 135;
    }
  };
  static move_unit(inData) {
    let opt_obj = {
      main: null,
      ...inData
    };
    let main = opt_obj.main;
    let this_obj = this;
    let map=main.map;

    for (let key in main.data.unit_json) {
      let unit = main.data.unit_json[key];
      if (unit.is_move) {
        if (unit.degree == 270) {
          unit.x -= unit.speed;
        } else if (unit.degree == 90) {
          unit.x += unit.speed;
        } else if (unit.degree == 0) {
          unit.y -= unit.speed;
        } else if (unit.degree == 180) {
          unit.y += unit.speed;
        } else if (unit.degree == 315) {
          unit.x -= unit.speed * Math.sqrt(2) / 2;
          unit.y -= unit.speed * Math.sqrt(2) / 2;
        } else if (unit.degree == 225) {
          unit.x -= unit.speed * Math.sqrt(2) / 2;
          unit.y += unit.speed * Math.sqrt(2) / 2;
        } else if (unit.degree == 45) {
          unit.x += unit.speed * Math.sqrt(2) / 2;
          unit.y -= unit.speed * Math.sqrt(2) / 2;
        } else if (unit.degree == 135) {
          unit.x += unit.speed * Math.sqrt(2) / 2;
          unit.y += unit.speed * Math.sqrt(2) / 2;
        }

        let view_x = unit.x - unit.w / 2;
        let view_y = unit.y - unit.h / 2;

        if(unit.x<0){
          unit.x=0;
        }
        if(unit.x>map.data.w-unit.w){
          unit.x-map.data.w-unit.w;
        }
        if(unit.y<0){
          unit.y=0;
        }
        if(unit.y>map.data.h-unit.h){
          unit.y=map.data.h-unit.h;
        }
      }
    }
  }
  static attact_unit(inData) {
    let opt_obj = {
      main: null,
      ...inData
    };
    let main = opt_obj.main;
    let this_obj = this;
    let select_unit = main.data.unit_json[main.data.select_unit_id];
    if (select_unit == undefined) {
      return false;
    }
  }
  static check_player_connect(inData) {
    let opt_obj = {
      main: null,
      ...inData
    };
    let main = opt_obj.main;
    let this_obj = this;

    for (let key in main.data.unit_json) {
      let unit = main.data.unit_json[key];
      if (unit.type == "player") {
        unit.connect_time_out += main.data.loop_frame;
        if (unit.connect_time_out > 5000) {
          delete main.data.unit_json[key];
        }
      }
    }
    let select_unit = main.data.unit_json[main.data.select_unit_id];
    if (select_unit == undefined) {
      return false;
    }
    select_unit.connect_time_out = 0;
  }
  static send_select_unit_to_server(inData) {
    let opt_obj = {
      main: null,
      ...inData
    };
    let main = opt_obj.main;
    let this_obj = this;
    let select_unit = main.data.unit_json[main.data.select_unit_id];
    if (select_unit == undefined) {
      return false;
    }

    if (main.data.is_host == false) {
      let select_unit_id = select_unit.id;
      let update_unit_json = {};
      update_unit_json[select_unit_id] = {
        direction: select_unit.direction,
        degree: select_unit.degree,
        is_move: select_unit.is_move,
        is_attack: select_unit.is_attack,
        connect_time_out: 0,
      };
      main.data.socket.emit('update_unit_json', update_unit_json);
    }
  };
}
export default ControllUnit;