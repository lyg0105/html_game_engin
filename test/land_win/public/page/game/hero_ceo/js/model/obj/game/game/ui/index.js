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
      main.control.set_page_state({ state: "game_menu", is_render: true });
    };
    game.data.buttons.push(back_btn);
  }

  render() {
    let this_obj = this;
    let main = this.main;
    let ctx = main.model.data.html.ctx;
    let canvas_w = main.model.data.canvas.width;
    let canvas_h = main.model.data.canvas.height;
    let game=main.model.data.page_obj;

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

    // HUD - 골드
    let total_gold = main.model.data.game_data.gold;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(10, 8, 120, 30);
    ctx.fillStyle = "#f5c518";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("💰 " + total_gold + "G", 18, 23);
    ctx.restore();

    // 미니맵 (오른쪽 위)
    this_obj._render_minimap(ctx, canvas_w, canvas_h, game);

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
      ctx.fillText(msg, canvas_w / 2, canvas_h / 2 - 30);
      if (result === "win" && game.data.earned_gold > 0) {
        ctx.fillStyle = "#f5c518";
        ctx.font = "bold 28px Arial";
        ctx.fillText("💰 +" + game.data.earned_gold + "G 획득!", canvas_w / 2, canvas_h / 2 + 30);
      }
      ctx.restore();
    }
  }

  _render_minimap(ctx, canvas_w, canvas_h, game) {
    let map_w = game.data.map.w;
    let map_h = game.data.map.h;
    let cam = game.data.camera;

    // 미니맵 크기 (비율 유지, 최대 100px)
    let mini_max = 100;
    let ratio = map_w / map_h;
    let mini_w, mini_h;
    if (ratio >= 1) {
      mini_w = mini_max;
      mini_h = Math.floor(mini_max / ratio);
    } else {
      mini_h = mini_max;
      mini_w = Math.floor(mini_max * ratio);
    }

    // back 버튼 아래 오른쪽에 배치
    let mini_x = canvas_w - mini_w - 10;
    let mini_y = 55;

    let scale_x = mini_w / map_w;
    let scale_y = mini_h / map_h;

    // 미니맵 배경
    ctx.save();
    ctx.fillStyle = "rgba(10,30,10,0.85)";
    ctx.strokeStyle = "#4a90d9";
    ctx.lineWidth = 1.5;
    ctx.fillRect(mini_x, mini_y, mini_w, mini_h);
    ctx.strokeRect(mini_x, mini_y, mini_w, mini_h);

    // 유닛 점 렌더
    let unit_control = game.unit_control;
    if (unit_control) {
      [...unit_control.player_arr, ...unit_control.monster_arr].forEach(function(u) {
        let ux = mini_x + (u.x + u.w / 2) * scale_x;
        let uy = mini_y + (u.y + u.h / 2) * scale_y;
        ctx.beginPath();
        ctx.arc(ux, uy, u.hp <= 0 ? 1 : 2, 0, Math.PI * 2);
        ctx.fillStyle = u.hp <= 0 ? "#555" : (u.is_player ? "#4a90e2" : "#e94560");
        ctx.fill();
      });
    }

    // 뷰포트 사각형 (현재 보이는 영역)
    let vp_x = mini_x + cam.x * scale_x;
    let vp_y = mini_y + cam.y * scale_y;
    let vp_w = Math.min(mini_w, canvas_w * scale_x);
    let vp_h = Math.min(mini_h, canvas_h * scale_y);
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 1;
    ctx.strokeRect(vp_x, vp_y, vp_w, vp_h);

    ctx.restore();
  }
}
export default UIArea;
