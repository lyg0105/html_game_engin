class UIArea {
  main;
  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    
    let game=main.model.data.page_obj;
    game.data.buttons = [];

    // 뒤로가기 버튼
    let canvas_w = main.model.data.canvas.width;
    let BasicButton = main.model.data.object.common.button.basic;
    let back_btn = new BasicButton({
      name: "back",
      text: "나가기",
      x: canvas_w - 120,
      y: 10,
      width: 100,
      height: 36,
      color: "#fff",
      backgroundColor: "#444",
      borderColor: "#888",
      borderWidth: 1,
    });
    back_btn.data.on_click = function () {
      game.control_area.stop();
      main.control.set_page_state({ state: "select_stage", is_render: true });
    };
    game.data.buttons.push(back_btn);

  }
  
  render() {
    let this_obj = this;
    let main = this.main;
    let ctx = main.model.data.html.ctx;
    let canvas_w = main.model.data.canvas.width;
    let canvas_h = main.model.data.canvas.height;
    let game=main.model.data.page_obj

    // HUD - 타이머
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(canvas_w / 2 - 90, 8, 180, 30);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("남은 시간: " + Math.ceil(game.data.timer) + "초", canvas_w / 2, 23);
    ctx.restore();

    // 버튼 렌더
    game.data.buttons.forEach(b => b.render(ctx));

    // 게임 종료 결과 오버레이
    if (game.data.game_result) {
      let result = game.data.game_result;
      let msg = result === "win" ? "승리!" : result === "lose" ? "패배..." : "시간 종료!";
      let color = result === "win" ? "#2ecc71" : result === "lose" ? "#e74c3c" : "#f5a623";

      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(0, 0, canvas_w, canvas_h);
      ctx.fillStyle = color;
      ctx.font = "bold 56px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(msg, canvas_w / 2, canvas_h / 2);
      ctx.restore();
    }
  }
}
export default UIArea;
