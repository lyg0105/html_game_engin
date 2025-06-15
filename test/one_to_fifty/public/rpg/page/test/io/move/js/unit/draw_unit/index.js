class DrawUnit {
  static action(inData) {
    let opt_obj = {
      main: null,
      ...inData
    };
    let main = opt_obj.main;
    let this_obj = this;

    const ctx = main.data.ctx;
    const unit_json = main.data.unit_json;
    const select_id = main.data.select_unit_id;
    for (let id in unit_json) {
      const unit = unit_json[id];
      if (unit.type == "player") {
        this_obj.draw_player({
          main: main,
          unit: unit
        });
      } else {
        this_obj.common_draw({
          main: main,
          unit: unit
        });
      }

      // Highlight selected unit
      if (id === select_id) {
        let view_x=unit.x+main.map.screen.x;
        let view_y=unit.y+main.map.screen.y;
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;
        ctx.strokeRect(view_x, view_y, unit.width, unit.height);
      }
    }
  }
  static common_draw(inData) {
    let opt_obj = {
      main: null,
      unit: null,
      ...inData
    };
    let main = opt_obj.main;
    const ctx = main.data.ctx;
    let unit = opt_obj.unit;
    let map= main.map;

    if (unit && main.data.unit_sprite_images[unit.type]) {
      let view_x=unit.x+map.screen.x;
      let view_y=unit.y+map.screen.y;

      const sprite = main.data.unit_sprite_images[unit.type];
      ctx.drawImage(sprite, view_x, view_y, unit.width, unit.height);
      ctx.fillStyle = 'white';
      ctx.fillText(unit.id, view_x, view_y - 10);
    }
  }
  static draw_player(inData) {
    let opt_obj = {
      main: null,
      unit: null,
      ...inData
    };
    let this_obj = this;
    let main = opt_obj.main;
    let unit = opt_obj.unit;
    const ctx = main.data.ctx;
    let view_x=unit.x+main.map.screen.x;
    let view_y=unit.y+main.map.screen.y;

    if (unit && main.data.unit_sprite_images[unit.type]) {
      const sprite = main.data.unit_sprite_images[unit.type];
      let sprite_data = main.data.unit_img_data[unit.type];
      let sprite_xy = this_obj.get_player_sprite_xy(opt_obj);
      let sprite_x= sprite_data.width*sprite_xy[0];
      let sprite_y= sprite_data.height*sprite_xy[1];
      if(unit.direction=="left"){
        ctx.save();
        ctx.scale(-1, 1); // x축 반전
        ctx.drawImage(sprite, sprite_x, sprite_y, sprite_data.width, sprite_data.height,
        -view_x-unit.width, view_y, unit.width, unit.height);
        ctx.restore();
      }else{
        ctx.drawImage(sprite, sprite_x, sprite_y, sprite_data.width, sprite_data.height,
        view_x, view_y, unit.width, unit.height);
      }
      
      ctx.fillStyle = 'white';
      ctx.fillText(unit.name, view_x, view_y - 10);
    }
  };
  static get_player_sprite_xy(inData) {
    let opt_obj = {
      main: null,
      unit: null,
      ...inData
    };
    let this_obj = this;
    let main = opt_obj.main;
    let unit = opt_obj.unit;
    let sprite_xy = [0, 0];
    if (main.data.unit_img_data[unit.type]) {
      let sprite_data = main.data.unit_img_data[unit.type];
      if (unit.is_move == false && unit.is_attack == false) {
        if (unit["direction"] == "up") {
          sprite_xy = sprite_data.idle_back[0];
        }else if (unit["direction"] == "down") {
          sprite_xy = sprite_data.idle_front[0];
        } else if (unit["direction"] == "left") {
          sprite_xy = sprite_data.idle_side[0];
        } else if (unit["direction"] == "right") {
          sprite_xy = sprite_data.idle_side[0];
        }
      }
      if(unit.is_move){
        let sprite_idx=0;
        if(unit.state_frame!=0&& unit.state_frame_max!=0){
          sprite_idx = Math.floor((unit.state_frame/unit.state_frame_max)*sprite_data.move_back.length);
        }
        if (sprite_idx >= sprite_data.move_back.length) {
          sprite_idx = 0;
        }
        
        if (unit["direction"] == "up") {
          sprite_xy = sprite_data.move_back[sprite_idx];
        }else if (unit["direction"] == "down") {
          sprite_xy = sprite_data.move_front[sprite_idx];
        } else if (unit["direction"] == "left") {
          sprite_xy = sprite_data.move_side[sprite_idx];
        } else if (unit["direction"] == "right") {
          sprite_xy = sprite_data.move_side[sprite_idx];
        }
      }
      if(unit.is_attack){
        let sprite_idx=0;
        if(unit.state_frame!=0&& unit.state_frame_max!=0){
          sprite_idx = Math.floor((unit.state_frame/unit.state_frame_max)*sprite_data.attack_back.length);
        }
        if (sprite_idx >= sprite_data.attack_back.length) {
          sprite_idx = 0;
        }
        if (unit["direction"] == "up") {
          sprite_xy = sprite_data.attack_back[sprite_idx];
        }else if (unit["direction"] == "down") {
          sprite_xy = sprite_data.attack_front[sprite_idx];
        } else if (unit["direction"] == "left") {
          sprite_xy = sprite_data.attack_side[sprite_idx];
        } else if (unit["direction"] == "right") {
          sprite_xy = sprite_data.attack_side[sprite_idx];
        }
      }
    }
    return sprite_xy;
  }
}
export default DrawUnit;