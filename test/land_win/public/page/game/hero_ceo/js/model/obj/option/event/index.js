class ObjEvent {
  main;
  drag_slider = null;
  drag_slider_candidate = null;
  constructor(main) {
    this.main = main;
    this.init();
  }
  init() {
    let this_obj = this;
    let main = this.main;

    main.control.event.on_mousedown_custom = function (e) {
      let item = this_obj.get_option_item_by_mouse();
      if (item && item.type === "slider") {
        this_obj.drag_slider_candidate = item;
      }
    };

    main.control.event.on_mouseup_custom = function (e) {
      this_obj.drag_slider_candidate = null;
      this_obj.drag_slider = null;
      let button = this_obj.get_button_by_mouse();
      if (button && button.data.on_click) {
        button.data.on_click();
        return;
      }

      let item = this_obj.get_option_item_by_mouse();
      if (item && item.type === "checkbox") {
        this_obj.toggle_checkbox(item);
      }
    };

    main.control.event.on_mousemove_custom = function (e) {
      if (this_obj.drag_slider_candidate && main.control.event.data.mouse_down) {
        this_obj.drag_slider = this_obj.drag_slider_candidate;
      }
      if (this_obj.drag_slider) {
        this_obj.update_slider(this_obj.drag_slider);
        return;
      }

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
    };
  }

  toggle_checkbox(item) {
    let main = this.main;
    let current = main.model.data.game_option[item.name];
    main.model.data.game_option[item.name] = !current;
    localStorage.setItem('hero_ceo_' + item.name, String(!current));
    main.view.render();
  }

  update_slider(item) {
    let main = this.main;
    let m_x = main.control.event.data.mouse_x;
    if (m_x < item.slider_x) {
      m_x = item.slider_x;
    }
    if (m_x > item.slider_x + item.slider_w) {
      m_x = item.slider_x + item.slider_w;
    }
    let val = (m_x - item.slider_x) / item.slider_w;
    val = Math.max(0, Math.min(1, val));
    val = Math.round(val * 100) / 100;
    main.model.data.game_option[item.name] = val;
    localStorage.setItem('hero_ceo_' + item.name, String(val));
    main.view.render();
  }

  get_option_item_by_mouse() {
    let main = this.main;
    let option = main.model.data.object.option;
    let m_x = main.control.event.data.mouse_x;
    let m_y = main.control.event.data.mouse_y;
    let items = option.optionArr.data.opt_arr;

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item.type === "checkbox") {
        if (
          m_x >= item.box_x && m_x <= item.box_x + item.box_size &&
          m_y >= item.box_y && m_y <= item.box_y + item.box_size
        ) {
          return item;
        }
      } else if (item.type === "slider") {
        if (
          m_x >= item.slider_x && m_x <= item.slider_x + item.slider_w &&
          Math.abs(m_y - item.slider_y) <= 15
        ) {
          return item;
        }
      }
    }
    return null;
  }

  get_button_by_mouse() {
    let this_obj = this;
    let main = this.main;

    let button = null;
    let option = main.model.data.object.option;
    let m_x = main.control.event.data.mouse_x;
    let m_y = main.control.event.data.mouse_y;

    let buttons = option.buttons.data.buttons;
    for (let i = 0; i < buttons.length; i++) {
      let b = buttons[i];
      if (m_x >= b.data.x && m_x <= b.data.x + b.data.width && m_y >= b.data.y && m_y <= b.data.y + b.data.height) {
        button = b;
        break;
      }
    }
    return button;
  };
}
export default ObjEvent;
