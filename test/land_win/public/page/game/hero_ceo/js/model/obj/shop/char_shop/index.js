import UIArea from "./ui/index.js";
import ObjEvent from "./event/index.js";

class CharShop {
  main;
  data = {
    buttons: [],
    shop_chars: [],   // 현재 표시 중인 캐릭터 3마리 (구매 시 null)
    card_layout: [],  // 각 카드의 x,y,w,h
    notice: { text: '', expire_at: 0 },
  };
  constructor(main) {
    this.main = main;
  }
  get_char_price() {
    return this.main.model.data.game_data.char_arr.length * 100;
  }
  get_reroll_cost() {
    return Math.min(2000, Math.max(100, this.main.model.data.game_data.char_arr.length * 100));
  }
  show_notice(text) {
    let this_obj = this;
    let main = this.main;
    this_obj.data.notice.text = text;
    this_obj.data.notice.expire_at = Date.now() + 500;
    main.view.render();
    setTimeout(function() {
      if (main.model.data.page_obj === this_obj) {
        main.view.render();
      }
    }, 500);
  }
  roll_chars() {
    let this_obj = this;
    let main = this.main;
    let char_list = main.model.data.object.common.char.data.char_list.char_arr;
    let job_data = main.model.data.object.common.char.data.char_list.job_data;
    let mini_char = main.model.data.object.common.char.data.char_list.sprite_data.mini_char;
    let owned_ids = main.model.data.game_data.char_arr.map(function(c) { return c.id; });
    let available = char_list.filter(function(c) { return !owned_ids.includes(c.id); });
    let pool = [...available];
    let picked = [];
    for (let i = 0; i < 3 && pool.length > 0; i++) {
      let idx = Math.floor(Math.random() * pool.length);
      let base = pool[idx];
      let jd = job_data[base.job];
      let char = { ...base };
      if (jd) {
        function rnd_range(arr) { return arr[0] + Math.random() * (arr[1] - arr[0]); }
        function rnd_int(arr) { return Math.floor(arr[0] + Math.random() * (arr[1] - arr[0] + 1)); }
        function rnd_pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
        char.hp            = rnd_int(jd.hp);
        char.mp            = rnd_int(jd.mp);
        char.attack        = rnd_int(jd.attack);
        char.defense       = rnd_int(jd.defense);
        char.attack_speed  = Math.round(rnd_range(jd.attack_speed) * 100) / 100;
        char.attack_range  = rnd_int(jd.attack_range);
        char.attack_type   = rnd_pick(jd.attack_type);
        char.attack_element= rnd_pick(jd.attack_element);
        char.critical_per  = rnd_int(jd.critical_per);
        char.critical_dam  = rnd_range(jd.critical_dam);
        char.move_speed    = Math.round(rnd_range(jd.move_speed) * 100) / 100;
      }
      char.sprite = 'mini_char';
      char.sprite_part_json = {
        face:      Math.floor(Math.random() * mini_char.face.length),
        head:      Math.floor(Math.random() * mini_char.head.length),
        side_hair: Math.floor(Math.random() * mini_char.side_hair.length),
        chest:     Math.floor(Math.random() * mini_char.chest.length),
        arm_l:     Math.floor(Math.random() * mini_char.arm_l.length),
        arm_r:     Math.floor(Math.random() * mini_char.arm_r.length),
        leg_l:     Math.floor(Math.random() * mini_char.leg_l.length),
        leg_r:     Math.floor(Math.random() * mini_char.leg_r.length),
      };
      picked.push(char);
      pool.splice(idx, 1);
    }
    this_obj.data.shop_chars = picked;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    this_obj.roll_chars();
    new UIArea(main);
    new ObjEvent(main);
  }
  render() {
    let this_obj = this;
    let main = this.main;
    let ctx = main.model.data.html.ctx;
    let canvas_w = main.model.data.canvas.width;
    let canvas_h = main.model.data.canvas.height;

    // 배경
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, canvas_w, canvas_h);

    // 타이틀
    let title_size = Math.max(16, Math.min(24, canvas_w * 0.032));
    ctx.fillStyle = '#e8c547';
    ctx.font = 'bold ' + title_size + 'px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('캐릭터 상점', canvas_w / 2, 28);

    // 보유 골드
    let gold = main.model.data.game_data.gold;
    let info_size = Math.max(12, Math.min(16, canvas_w * 0.022));
    ctx.fillStyle = '#f0d060';
    ctx.font = info_size + 'px Arial';
    ctx.fillText('보유 골드: ' + gold.toLocaleString() + '원', canvas_w / 2, 56);

    // 캐릭터 카드
    let card_layout = this_obj.data.card_layout;
    let shop_chars = this_obj.data.shop_chars;
    let card_font = Math.max(10, Math.min(13, canvas_w * 0.016));
    let line_h = card_font + 8;

    for (let idx = 0; idx < 3; idx++) {
      let layout = card_layout[idx];
      if (!layout) continue;
      let x = layout.x;
      let y = layout.y;
      let w = layout.w;
      let h = layout.h;
      let char = shop_chars[idx];

      if (!char) {
        // 품절 카드
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#333355';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = '#555577';
        ctx.font = card_font + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('품절', x + w / 2, y + h / 2 - 20);
      } else {
        // 카드 배경
        ctx.fillStyle = '#1a2a4a';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#4a7ab5';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);

        let cx = x + w / 2;
        let ty = y + 22;

        // 이름
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold ' + (card_font + 2) + 'px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(char.name, cx, ty);
        ty += line_h + 2;

        // 직업 / 종족
        ctx.fillStyle = '#a0c4ff';
        ctx.font = card_font + 'px Arial';
        ctx.fillText(char.job + ' / ' + char.race, cx, ty);
        ty += line_h + 6;

        // 구분선
        ctx.strokeStyle = '#2a4a7a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 6, ty - 2);
        ctx.lineTo(x + w - 6, ty - 2);
        ctx.stroke();

        // 스탯
        let stat_size = Math.max(9, card_font - 1);
        ctx.fillStyle = '#aaccee';
        ctx.font = stat_size + 'px Arial';
        ctx.fillText('HP ' + char.hp + '  MP ' + char.mp, cx, ty + 6);
        ty += line_h;
        ctx.fillText('공격 ' + char.attack + '  방어 ' + char.defense, cx, ty);
        ty += line_h;
        ctx.fillText('이동 ' + char.move_speed + '  치명 ' + char.critical_per + '%', cx, ty);
      }

      // 구매 버튼 텍스트/색 동적 업데이트
      let buy_btn = null;
      for (let b = 0; b < this_obj.data.buttons.length; b++) {
        if (this_obj.data.buttons[b].data.name === 'buy_' + idx) {
          buy_btn = this_obj.data.buttons[b];
          break;
        }
      }
      if (buy_btn) {
        if (!char) {
          buy_btn.data.text = '품절';
          buy_btn.data.backgroundColor = '#2a2a3a';
          buy_btn.data.color = '#555577';
        } else {
          let price = this_obj.get_char_price();
          buy_btn.data.text = '구매 (' + price + '원)';
          let can_afford = gold >= price;
          buy_btn.data.backgroundColor = can_afford ? '#1a5a2a' : '#4a2a2a';
          buy_btn.data.color = can_afford ? '#88ee88' : '#ee8888';
        }
      }
    }

    // 리롤 버튼 텍스트/색 업데이트
    for (let b = 0; b < this_obj.data.buttons.length; b++) {
      if (this_obj.data.buttons[b].data.name === 'reroll') {
        let reroll_cost = this_obj.get_reroll_cost();
        let can_reroll = gold >= reroll_cost;
        this_obj.data.buttons[b].data.text = '리롤 (' + reroll_cost + '원)';
        this_obj.data.buttons[b].data.backgroundColor = can_reroll ? '#5a2a8a' : '#3a2a4a';
        this_obj.data.buttons[b].data.color = can_reroll ? '#cc88ff' : '#886699';
        break;
      }
    }

    // 모든 버튼 렌더
    this_obj.data.buttons.forEach(function(button) {
      button.render(ctx);
    });

    // 알림 메시지
    let notice = this_obj.data.notice;
    if (notice.text && Date.now() < notice.expire_at) {
      let msg_font = Math.max(14, Math.min(20, canvas_w * 0.028));
      let msg_w = Math.min(280, canvas_w * 0.6);
      let msg_h = msg_font + 28;
      let msg_x = canvas_w / 2 - msg_w / 2;
      let msg_y = canvas_h / 2 - msg_h / 2;
      ctx.save();
      ctx.fillStyle = 'rgba(20, 10, 10, 0.88)';
      ctx.fillRect(msg_x, msg_y, msg_w, msg_h);
      ctx.strokeStyle = '#cc4444';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(msg_x, msg_y, msg_w, msg_h);
      ctx.fillStyle = '#ff8888';
      ctx.font = 'bold ' + msg_font + 'px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(notice.text, canvas_w / 2, msg_y + msg_h / 2);
      ctx.restore();
    }
  }
}
export default CharShop;
