class LobbyEvent {
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
      if (button) {
        button.data.on_click();
      }
    };

    main.control.event.on_mousemove_custom = function (e) {
      if (navigator.maxTouchPoints > 0) {
        return false;
      }
      let button = this_obj.get_button_by_mouse();
      if(button) {
        main.model.data.html.canvas.style.cursor = "pointer";
        button.on_hover({
          ctx: main.model.data.html.ctx,
        });
      }else{
        main.model.data.html.canvas.style.cursor = "default";
        main.view.render();
      }
    };
    
  }

  get_button_by_mouse() {
    let this_obj = this;
    let main = this.main;

    let button = null;
    let lobby = main.model.data.object.lobby;
    let m_x = main.control.event.data.mouse_x;
    let m_y = main.control.event.data.mouse_y;

    let buttons = lobby.data.buttons;
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
export default LobbyEvent;