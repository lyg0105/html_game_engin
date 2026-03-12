class ObjEvent {
  main;
  constructor(main) {
    this.main = main;
    this.init();
  }
  init() {
    let this_obj = this;
    let main = this.main;

    main.control.event.on_mouseup_custom = function (e) {
      let button = this_obj.get_button_by_mouse();
      if (button && button.data.on_click) {
        button.data.on_click();
      }
      let card = this_obj.get_card_by_mounse();
      if (card && card.on_click) {
        card.on_click();
      }
    };

    main.control.event.on_mousemove_custom = function (e) {
      if (navigator.maxTouchPoints > 0) {
        return false;
      }
      let button = this_obj.get_button_by_mouse();
      if (button) {
        main.model.data.html.canvas.style.cursor = "pointer";
        button.on_hover({
          ctx: main.model.data.html.ctx,
        });
      } else {
        main.model.data.html.canvas.style.cursor = "default";
        main.view.render();
      }
      let card = this_obj.get_card_by_mounse();
      if (card) {
        main.model.data.html.canvas.style.cursor = "pointer";
      } else {
        main.model.data.html.canvas.style.cursor = "default";
      }
    };

  }

  get_button_by_mouse() {
    let this_obj = this;
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
  get_card_by_mounse() {
    let this_obj = this;
    let main = this.main;

    let card = null;
    let page_obj = main.model.data.page_obj;
    let m_x = main.control.event.data.mouse_x;
    let m_y = main.control.event.data.mouse_y;

    if (page_obj.stage_list_area && page_obj.stage_list_area.card_list) {
    } else {
      return card;
    }
    let card_list = page_obj.stage_list_area.card_list;
    for (let i = 0; i < card_list.length; i++) {
      let b = card_list[i];
      if (m_x >= b.x && m_x <= b.x + b.w && m_y >= b.y && m_y <= b.y + b.h) {
        card = b;
        break;
      }
    }
    return card;
  }
}
export default ObjEvent;