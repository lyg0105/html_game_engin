class ObjEvent {
  main;
  constructor(main) {
    this.main = main;
    this.init();
  }
  init() {
    let this_obj = this;
    let main = this.main;

    main.control.event.on_mouseup_custom = function () {
      // 선택 슬롯 클릭 → 해제
      let slot = this_obj.get_select_slot_by_mouse();
      if (slot) {
        let page_obj = main.model.data.page_obj;
        page_obj.data.select_char_arr.splice(slot.index, 1);
        main.view.render();
        return;
      }

      // 네비게이션 화살표 체크
      let nav = this_obj.get_nav_arrow_by_mouse();
      if (nav) {
        let page_obj = main.model.data.page_obj;
        let char_arr = page_obj.data.char_arr;
        let visible_count = page_obj.data.visible_count || 1;
        let max_scroll = page_obj.data.max_scroll !== undefined
          ? page_obj.data.max_scroll
          : Math.max(0, char_arr.length - visible_count);
        let scroll_index = page_obj.data.scroll_index || 0;
        if (nav === 'left') {
          page_obj.data.scroll_index = Math.max(0, scroll_index - 1);
        } else {
          page_obj.data.scroll_index = Math.min(max_scroll, scroll_index + 1);
        }
        main.view.render();
        return;
      }

      let button = this_obj.get_button_by_mouse();
      if (button&&button.data.on_click) {
        button.data.on_click();
        return;
      }
      let char_card = this_obj.get_char_card_by_mouse();
      if (char_card) {
        this_obj.toggle_select_char(char_card.char_data);
        main.view.render();
      }
    };

    main.control.event.on_mousemove_custom = function () {
      if (navigator.maxTouchPoints > 0) {
        return false;
      }
      let slot = this_obj.get_select_slot_by_mouse();
      if (slot) {
        main.model.data.html.canvas.style.cursor = "pointer";
        return;
      }
      let nav = this_obj.get_nav_arrow_by_mouse();
      if (nav) {
        main.model.data.html.canvas.style.cursor = "pointer";
        main.view.render();
        return;
      }
      let button = this_obj.get_button_by_mouse();
      if(button) {
        main.model.data.html.canvas.style.cursor = "pointer";
        button.on_hover({
          ctx: main.model.data.html.ctx,
        });
      }else{
        let char_card = this_obj.get_char_card_by_mouse();
        main.model.data.html.canvas.style.cursor = char_card ? "pointer" : "default";
        if (!char_card) {
          main.view.render();
        }
      }
    };

  }

  get_select_slot_by_mouse() {
    let main = this.main;
    let page_obj = main.model.data.page_obj;
    let m_x = main.control.event.data.mouse_x;
    let m_y = main.control.event.data.mouse_y;
    let select_slots = page_obj.data.select_slots || [];
    for (let i = 0; i < select_slots.length; i++) {
      let s = select_slots[i];
      if (m_x >= s.x && m_x <= s.x + s.width && m_y >= s.y && m_y <= s.y + s.height) return s;
    }
    return null;
  }

  get_nav_arrow_by_mouse() {
    let main = this.main;
    let page_obj = main.model.data.page_obj;
    let m_x = main.control.event.data.mouse_x;
    let m_y = main.control.event.data.mouse_y;
    let nav_arrows = page_obj.data.nav_arrows || {};
    if (nav_arrows.left) {
      let a = nav_arrows.left;
      if (m_x >= a.x && m_x <= a.x + a.width && m_y >= a.y && m_y <= a.y + a.height) return 'left';
    }
    if (nav_arrows.right) {
      let a = nav_arrows.right;
      if (m_x >= a.x && m_x <= a.x + a.width && m_y >= a.y && m_y <= a.y + a.height) return 'right';
    }
    return null;
  }

  get_button_by_mouse() {
    let main = this.main;

    let button = null;
    let page_obj = main.model.data.page_obj;
    let m_x = main.control.event.data.mouse_x;
    let m_y = main.control.event.data.mouse_y;

    let buttons = page_obj.data.buttons;
    for (let i = 0; i < buttons.length; i++) {
      let b = buttons[i];
      if (m_x >= b.data.x && m_x <= b.data.x + b.data.width && m_y >= b.data.y && m_y <= b.data.y + b.data.height) {
        button = b;
        break;
      }
    }
    return button;
  };

  get_char_card_by_mouse() {
    let main = this.main;
    let page_obj = main.model.data.page_obj;
    let m_x = main.control.event.data.mouse_x;
    let m_y = main.control.event.data.mouse_y;
    let char_cards = page_obj.data.char_cards || [];
    for (let i = 0; i < char_cards.length; i++) {
      let c = char_cards[i];
      if (m_x >= c.x && m_x <= c.x + c.width && m_y >= c.y && m_y <= c.y + c.height) {
        return c;
      }
    }
    return null;
  }

  toggle_select_char(char_data) {
    let main = this.main;
    let page_obj = main.model.data.page_obj;
    let select_char_arr = page_obj.data.select_char_arr;
    let idx = select_char_arr.findIndex(function(c){ return c && c.id === char_data.id; });
    if (idx >= 0) {
      select_char_arr.splice(idx, 1);
    } else {
      if (select_char_arr.length >= 10) return;
      select_char_arr.push(char_data);
    }
  }
}
export default ObjEvent;
