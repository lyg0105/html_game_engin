class StageListArea {
  main;
  start_y=20;
  end_y=0;
  pad=10;
  card_gap=8;
  default_card_row={
    w:100,
    h:80,
    x:0,
    y:0,
    hover_background_color:"#777",
    on_click:null,
    stage_data:null,
  };
  card_list=[];

  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    let stage_list = main.model.data.object.common.char.data.stage_list;
    let page_obj = main.model.data.page_obj;

    let canvas_w = main.model.data.canvas.width;
    this_obj.default_card_row.x=this_obj.pad;
    this_obj.default_card_row.w=canvas_w - this_obj.pad * 2;
    let card_gap = 8;
    let start_y = this_obj.start_y+100;

    stage_list.stage_arr.forEach(function (stage, i) {
      let card_y = start_y + (this_obj.default_card_row.h + this_obj.card_gap) * i;
      this_obj.end_y=card_y+this_obj.default_card_row.h;
      this_obj.card_list.push({
        ...this_obj.default_card_row,
        y:card_y,
        stage_data:stage,
        on_click:()=>{
          main.model.data.game_data.select_stage=stage;
          main.control.set_page_state({state:"game", is_render:true});
        },
      });
    });
    
  }
  render() {
    let this_obj = this;
    let main = this.main;
    let ctx = main.model.data.html.ctx;
    let card_list = this_obj.card_list;

    let canvas_w = main.model.data.canvas.width;
    let canvas_h = main.model.data.canvas.height;

    // 배경
    ctx.save();
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas_w, canvas_h);
    ctx.restore();

    // 제목
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("스테이지 선택", canvas_w / 2, this_obj.start_y + 50);
    ctx.restore();

    let info_x_ratio = 0.35;

    card_list.forEach(function (card, i) {
      let stage = card.stage_data;
      let cx = card.x;
      let cy = card.y;
      let cw = card.w;
      let ch = card.h;
      let info_x = cx + cw * info_x_ratio;

      ctx.save();

      // 카드 배경
      ctx.fillStyle = "#16213e";
      ctx.fillRect(cx, cy, cw, ch);

      // 카드 테두리
      ctx.strokeStyle = "#0f3460";
      ctx.lineWidth = 2;
      ctx.strokeRect(cx, cy, cw, ch);

      // 왼쪽 강조바
      ctx.fillStyle = "#e94560";
      ctx.fillRect(cx, cy, 6, ch);

      // STAGE 번호
      ctx.fillStyle = "#e94560";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("STAGE " + (i + 1), cx + 20, cy + 12);

      // 레벨
      ctx.fillStyle = "#f5a623";
      ctx.font = "bold 13px Arial";
      ctx.fillText("LV." + stage.monster_level, cx + 20, cy + 40);

      // 몬스터 종류
      ctx.fillStyle = "#aaaaaa";
      ctx.font = "13px Arial";
      ctx.fillText("몬스터: " + stage.monster_race_arr.join(", "), info_x, cy + 12);

      // 몬스터 수 & 제한시간
      ctx.fillText(
        "수: " + stage.monster_cnt + "마리   제한: " + stage.end_sec + "초",
        info_x,
        cy + 40
      );

      // 오른쪽 화살표
      ctx.fillStyle = "#ffffff";
      ctx.font = "22px Arial";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText("▶", cx + cw - 20, cy + ch / 2);

      ctx.restore();
    });
  }
}
export default StageListArea;
