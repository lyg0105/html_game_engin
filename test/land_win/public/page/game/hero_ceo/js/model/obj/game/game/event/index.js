class EventAera {
  main;
  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    let game=main.model.data.page_obj

    // 마우스 이벤트
    main.control.event.on_mouseup_custom = function () {
      let m_x = main.control.event.data.mouse_x;
      let m_y = main.control.event.data.mouse_y;
      for (let b of game.data.buttons) {
        if (
          m_x >= b.data.x && m_x <= b.data.x + b.data.width &&
          m_y >= b.data.y && m_y <= b.data.y + b.data.height
        ) {
          if (b.data.on_click) b.data.on_click();
          break;
        }
      }
    };
    main.control.event.on_mousemove_custom = function () {
      let m_x = main.control.event.data.mouse_x;
      let m_y = main.control.event.data.mouse_y;
      let on_button = game.data.buttons.some(b =>
        m_x >= b.data.x && m_x <= b.data.x + b.data.width &&
        m_y >= b.data.y && m_y <= b.data.y + b.data.height
      );
      main.model.data.html.canvas.style.cursor = on_button ? "pointer" : "default";
    };
  }
}
export default EventAera;
