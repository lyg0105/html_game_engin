/**
 * 공통 ObjEvent
 *
 * 옵션:
 *   get_buttons   : function() → button[]  (기본: page_obj.data.buttons)
 *   on_mousedown  : function()             추가 mousedown 처리
 *   on_mouseup    : function()             추가 mouseup 처리 (버튼 처리 후 호출)
 *   on_mousemove  : function()             추가 mousemove 처리 (버튼 hover 후 호출)
 */
class ObjEvent {
  constructor(main, options = {}) {
    this.main = main;
    this.options = options;
    this.init();
  }

  init() {
    let self = this;
    let main = this.main;
    let opts = this.options;

    if (opts.on_mousedown) {
      main.control.event.on_mousedown_custom = function () {
        opts.on_mousedown();
      };
    }

    main.control.event.on_mouseup_custom = function () {
      let button = self.get_button_by_mouse();
      if (button && button.data.on_click) {
        button.data.on_click();
      }
      if (opts.on_mouseup) opts.on_mouseup();
    };

    main.control.event.on_mousemove_custom = function () {
      if (navigator.maxTouchPoints > 0) return false;

      let button = self.get_button_by_mouse();
      if (button) {
        main.model.data.html.canvas.style.cursor = "pointer";
        button.on_hover({ ctx: main.model.data.html.ctx });
      } else {
        main.model.data.html.canvas.style.cursor = "default";
        main.view.render();
      }

      if (opts.on_mousemove) opts.on_mousemove();
    };
  }

  get_button_by_mouse() {
    let main = this.main;
    let opts = this.options;
    let m_x = main.control.event.data.mouse_x;
    let m_y = main.control.event.data.mouse_y;

    let buttons = opts.get_buttons
      ? opts.get_buttons()
      : main.model.data.page_obj.data.buttons;

    for (let i = 0; i < buttons.length; i++) {
      let b = buttons[i];
      if (
        m_x >= b.data.x && m_x <= b.data.x + b.data.width &&
        m_y >= b.data.y && m_y <= b.data.y + b.data.height
      ) {
        return b;
      }
    }
    return null;
  }
}
export default ObjEvent;
