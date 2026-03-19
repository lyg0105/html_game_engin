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

    let canvas_w = main.model.data.canvas.width;
    let canvas_h = main.model.data.canvas.height;

    // 나가기 버튼 (커스텀)
    let btn_w = 90, btn_h = 34;
    let exit_btn = {
      data: {
        name: "back",
        x: canvas_w - btn_w - 10,
        y: 10,
        width: btn_w,
        height: btn_h,
        on_click: function () {
          game.control_area.stop();
          main.control.set_page_state({ state: "game_menu", is_render: true });
        },
      },
      render: function (ctx) {
        if (game.data.game_result) return; // 결과 화면에선 숨김
        let d = this.data;
        ctx.save();
        ctx.fillStyle = "rgba(20,10,10,0.82)";
        ctx.strokeStyle = "#c0392b";
        ctx.lineWidth = 1.5;
        ctx.fillRect(d.x, d.y, d.width, d.height);
        ctx.strokeRect(d.x, d.y, d.width, d.height);
        ctx.fillStyle = "#ff6b6b";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Leave", d.x + d.width / 2, d.y + d.height / 2);
        ctx.restore();
      },
    };
    game.data.buttons.push(exit_btn);

    // 결과 화면 버튼 (나가기 / 다시하기 / 무한반복)
    let rb_w = 110, rb_h = 44, rb_gap = 18;
    let rb_total_w = 3 * rb_w + 2 * rb_gap;
    let rb_sx = canvas_w / 2 - rb_total_w / 2;
    let rb_y = canvas_h / 2 + 80;
    let result_btn_cfgs = [
      {
        label: "나가기",
        fg: "#ff6b6b", bg: "rgba(70,10,10,0.92)", border: "#c0392b",
        on_click: function () {
          game.control_area.stop();
          main.control.set_page_state({ state: "game_menu", is_render: true });
        },
      },
      {
        label: "다시하기",
        fg: "#6baaff", bg: "rgba(10,25,70,0.92)", border: "#2980b9",
        on_click: function () {
          main.model.data.game_data.is_infinite = false;
          game.control_area.stop();
          main.control.set_page_state({ state: "game", is_render: true });
        },
      },
      {
        label: "무한반복",
        fg: "#6bffaa", bg: "rgba(10,55,20,0.92)", border: "#27ae60",
        on_click: function () {
          main.model.data.game_data.is_infinite = true;
          game.control_area.stop();
          main.control.set_page_state({ state: "game", is_render: true });
        },
      },
    ];
    result_btn_cfgs.forEach(function (cfg, i) {
      let bx = rb_sx + i * (rb_w + rb_gap);
      let btn = {
        data: {
          x: bx, y: rb_y, width: rb_w, height: rb_h,
          on_click: function () {
            if (!game.data.game_result) return;
            cfg.on_click();
          },
        },
        render: function (ctx) {
          if (!game.data.game_result) return;
          let d = this.data;
          ctx.save();
          ctx.fillStyle = cfg.bg;
          ctx.strokeStyle = cfg.border;
          ctx.lineWidth = 2;
          ctx.fillRect(d.x, d.y, d.width, d.height);
          ctx.strokeRect(d.x, d.y, d.width, d.height);
          ctx.fillStyle = cfg.fg;
          ctx.font = "bold 15px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(cfg.label, d.x + d.width / 2, d.y + d.height / 2);
          ctx.restore();
        },
      };
      game.data.buttons.push(btn);
    });
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
    ctx.fillText("Remain " + Math.ceil(game.data.timer) + "s", canvas_w / 2, 23);
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

      // 결과 버튼 렌더 (오버레이 위)
      game.data.buttons.forEach(b => b.render(ctx));
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
