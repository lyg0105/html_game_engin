class UIArea {
  main;
  constructor(main) {
    this.main = main;
    this.init();
  }
  init() {
    let main = this.main;
    let page_obj = main.model.data.page_obj;
    let canvas_w = main.model.data.canvas.width;
    let canvas_h = main.model.data.canvas.height;
    let BasicButton = main.model.data.object.common.button.basic;

    page_obj.data.buttons = [];

    // 카드 레이아웃 계산
    let padding = 10;
    let gap = 8;
    let num_cards = 3;
    let card_w = (canvas_w - padding * 2 - gap * (num_cards - 1)) / num_cards;
    let card_h = Math.min(Math.floor(canvas_h * 0.5), 290);
    let card_y = 76;
    let buy_btn_h = Math.max(34, Math.min(42, Math.floor(canvas_h * 0.068)));
    let buy_btn_w = card_w - 16;

    page_obj.data.card_layout = [];
    for (let i = 0; i < num_cards; i++) {
      page_obj.data.card_layout.push({
        x: padding + i * (card_w + gap),
        y: card_y,
        w: card_w,
        h: card_h,
      });
    }

    // 구매 버튼 (카드 하단)
    for (let i = 0; i < num_cards; i++) {
      let layout = page_obj.data.card_layout[i];
      let char_price = page_obj.get_char_price();
      let buy_button = new BasicButton({
        name: 'buy_' + i,
        text: '구매 (' + char_price + '원)',
        x: layout.x + (layout.w - buy_btn_w) / 2,
        y: layout.y + layout.h - buy_btn_h - 8,
        width: buy_btn_w,
        height: buy_btn_h,
        backgroundColor: char_price === 0 ? '#1a5a2a' : '#2a5a8a',
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#6aaad0',
      });

      (function(btn_index) {
        buy_button.data.on_click = function() {
          let char = page_obj.data.shop_chars[btn_index];
          if (!char) return;
          let price = page_obj.get_char_price();
          let gold = main.model.data.game_data.gold;
          if (gold < price) { page_obj.show_notice('돈이 부족합니다'); return; }
          main.model.data.game_data.gold -= price;
          main.model.data.game_data.char_arr.push(Object.assign({}, char));
          main.control.save.save();
          page_obj.data.shop_chars[btn_index] = null;
          main.view.render();
        };
      })(i);

      page_obj.data.buttons.push(buy_button);
    }

    // 리롤 버튼
    let reroll_cost = page_obj.get_reroll_cost();
    let reroll_btn_w = Math.min(200, Math.floor(canvas_w * 0.35));
    let reroll_btn_h = Math.max(34, Math.min(42, Math.floor(canvas_h * 0.068)));
    let reroll_y = card_y + card_h + 14;
    let reroll_button = new BasicButton({
      name: 'reroll',
      text: '리롤 (' + reroll_cost + '원)',
      x: canvas_w / 2 - reroll_btn_w / 2,
      y: reroll_y,
      width: reroll_btn_w,
      height: reroll_btn_h,
      backgroundColor: '#5a2a8a',
      color: '#cc88ff',
      borderWidth: 1,
      borderColor: '#a06ad0',
    });
    reroll_button.data.on_click = function() {
      let cost = page_obj.get_reroll_cost();
      let gold = main.model.data.game_data.gold;
      if (gold < cost) { page_obj.show_notice('돈이 부족합니다'); return; }
      main.model.data.game_data.gold -= cost;
      page_obj.roll_chars();
      main.view.render();
    };
    page_obj.data.buttons.push(reroll_button);

    // 뒤로 버튼
    let back_btn_w = Math.min(140, Math.floor(canvas_w * 0.24));
    let back_btn_h = Math.max(34, Math.min(42, Math.floor(canvas_h * 0.068)));
    let back_y = reroll_y + reroll_btn_h + 10;
    let back_button = new BasicButton({
      name: 'back',
      text: '뒤로',
      x: canvas_w / 2 - back_btn_w / 2,
      y: back_y,
      width: back_btn_w,
      height: back_btn_h,
      backgroundColor: '#2a2a4a',
      color: '#aaaacc',
      borderWidth: 1,
      borderColor: '#5a5a7a',
    });
    back_button.data.on_click = function() {
      main.control.set_page_state({ state: 'shop', is_render: true });
    };
    page_obj.data.buttons.push(back_button);
  }
}
export default UIArea;
