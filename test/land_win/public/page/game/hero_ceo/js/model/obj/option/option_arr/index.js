class OptionArr {
  main;
  init_y=0;
  data = {
    opt_arr: [
      {name:"is_game_sound",      text:"게임 사운드", type:"checkbox", value:true},
      {name:"is_background_sound",text:"게임 음악",   type:"checkbox", value:true},
      {name:"sound_volume",       text:"게임 음볼륨", type:"slider",   value:0.5},
      {name:"bgm_volume",         text:"배경음 볼륨", type:"slider",   value:0.5},
    ],
  };
  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    let game_option = main.model.data.game_option;
    let canvas_w = main.model.data.canvas.width;
    let row_w = 300;
    let row_h = 50;
    let start_y = this_obj.init_y;

    this_obj.data.opt_arr.forEach(function(item, i) {
      item.value = game_option[item.name];
      item.label_x = canvas_w/2-(row_w/2);
      item.y = start_y + row_h;
      start_y=item.y;
      item.row_h = row_h;

      if (item.type === "checkbox") {
        item.box_size = 24;
        item.box_x = item.label_x+row_w-item.box_size;
        item.box_y = item.y + (row_h - item.box_size) / 2;
      } else if (item.type === "slider") {
        item.slider_x = item.label_x+row_w - 160;
        item.slider_y = item.y + row_h / 2;
        item.slider_w = 120;
        item.slider_h = 6;
      }
    });
    this_obj.init_y=start_y;
  }

  render() {
    let this_obj = this;
    let main = this.main;
    let ctx = main.model.data.html.ctx;
    let game_option = main.model.data.game_option;

    this_obj.data.opt_arr.forEach(function(item) {
      let val = game_option[item.name];
      ctx.save();

      // 라벨
      ctx.fillStyle = "white";
      ctx.font = "18px Arial";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(item.text, item.label_x, item.y + item.row_h / 2);

      if (item.type === "checkbox") {
        // 박스 외곽
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(item.box_x, item.box_y, item.box_size, item.box_size);
        // 체크
        if (val) {
          ctx.fillStyle = "#4CAF50";
          ctx.fillRect(item.box_x + 4, item.box_y + 4, item.box_size - 8, item.box_size - 8);
        }
      } else if (item.type === "slider") {
        let sx = item.slider_x;
        let sy = item.slider_y;
        let sw = item.slider_w;
        let sh = item.slider_h;

        // 트랙 배경
        ctx.fillStyle = "#555";
        ctx.fillRect(sx, sy - sh / 2, sw, sh);

        // 채워진 부분
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(sx, sy - sh / 2, sw * val, sh);

        // 핸들
        let hx = sx + sw * val;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(hx, sy, 10, 0, Math.PI * 2);
        ctx.fill();

        // 퍼센트 텍스트
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(Math.round(val * 100) + "%", sx + sw + 14, sy);
      }

      ctx.restore();
    });
  }
}
export default OptionArr;
