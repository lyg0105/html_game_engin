class EventAera {
  main;
  constructor(main) {
    this.main = main;
  }
  init() {
    let main = this.main;
    let game = main.model.data.page_obj;

    main.control.event.on_mousedown_custom = function () {
      let m_x = main.control.event.data.mouse_x;
      let m_y = main.control.event.data.mouse_y;
      let on_btn = game.data.buttons.some(b =>
        m_x >= b.data.x && m_x <= b.data.x + b.data.width &&
        m_y >= b.data.y && m_y <= b.data.y + b.data.height
      );
      if (!on_btn) {
        let cam = game.data.camera;
        cam.is_drag = true;
        cam.drag_sx = m_x;
        cam.drag_sy = m_y;
        cam.drag_cx = cam.x;
        cam.drag_cy = cam.y;
        main.model.data.html.canvas.style.cursor = "grabbing";
      }
    };

    main.control.event.on_mouseup_custom = function () {
      let m_x = main.control.event.data.mouse_x;
      let m_y = main.control.event.data.mouse_y;
      game.data.camera.is_drag = false;
      main.model.data.html.canvas.style.cursor = "grab";
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
      let cam = game.data.camera;
      if (cam.is_drag) {
        let canvas_w = main.model.data.canvas.width;
        let canvas_h = main.model.data.canvas.height;
        let map_w = game.data.map.w;
        let map_h = game.data.map.h;
        let dx = m_x - cam.drag_sx;
        let dy = m_y - cam.drag_sy;
        let max_cx = Math.max(0, map_w - canvas_w);
        let max_cy = Math.max(0, map_h - canvas_h);
        cam.x = Math.max(0, Math.min(max_cx, cam.drag_cx - dx));
        cam.y = Math.max(0, Math.min(max_cy, cam.drag_cy - dy));
        return;
      }
      let on_button = game.data.buttons.some(b =>
        m_x >= b.data.x && m_x <= b.data.x + b.data.width &&
        m_y >= b.data.y && m_y <= b.data.y + b.data.height
      );
      main.model.data.html.canvas.style.cursor = on_button ? "pointer" : "grab";
    };
  }
}
export default EventAera;
