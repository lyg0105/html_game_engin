class Event {
  main;
  data = {
    mouse_x: 0,
    mouse_y: 0,
    mounse_down_x: 0,
    mounse_down_y: 0,
    mouse_up_x: 0,
    mouse_up_y: 0,
    mouse_down: false,
    mouse_up: false,
    key_down: {},
  };
  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    if (navigator.maxTouchPoints == 0) {
      main.model.data.html.canvas.addEventListener("mousemove", function (e) {
        this_obj.on_mousemove(e);
      });
      main.model.data.html.canvas.addEventListener("mousedown", function (e) {
        this_obj.on_mousedown(e);
      });
      main.model.data.html.canvas.addEventListener("mouseup", function (e) {
        this_obj.on_mouseup(e);
      });
    } else {
      main.model.data.html.canvas.addEventListener("touchmove", function (e) {
        if (e.touches.length > 0) {
          e.offsetX = e.touches[0].clientX;
          e.offsetY = e.touches[0].clientY;
          this_obj.on_mousemove(e);
        }
      });
      main.model.data.html.canvas.addEventListener("touchstart", function (e) {
        if (e.touches.length > 0) {
          e.offsetX = e.touches[0].clientX;
          e.offsetY = e.touches[0].clientY;
          this_obj.on_mousemove(e);
          this_obj.on_mousedown(e);
        }
      });
      main.model.data.html.canvas.addEventListener("touchend", function (e) {
        e.offsetX=this_obj.data.mouse_x;
        e.offsetY=this_obj.data.mouse_y;
        this_obj.on_mouseup(e);

        // if (e.touches.length > 0) {
        //   e.offsetX = e.touches[0].clientX;
        //   e.offsetY = e.touches[0].clientY;
        //   this_obj.on_mouseup(e);
        // }
      });
    }

    window.addEventListener("keydown", function (e) {
      this_obj.on_keydown(e);
    });
    window.addEventListener("keyup", function (e) {
      this_obj.on_keyup(e);
    });
  }

  on_mousemove(e) {
    let this_obj = this;
    let main = this.main;

    this_obj.data.mouse_x = e.offsetX;
    this_obj.data.mouse_y = e.offsetY;
    this_obj.on_mousemove_custom(e);
  }
  on_mousemove_custom(e) { };

  on_mousedown(e) {
    let this_obj = this;
    let main = this.main;

    this_obj.data.mouse_down = true;
    this_obj.data.mounse_down_x = e.offsetX;
    this_obj.data.mounse_down_y = e.offsetY;
    this_obj.on_mousedown_custom(e);
  }
  on_mousedown_custom(e) { };

  on_mouseup(e) {
    let this_obj = this;
    let main = this.main;

    this_obj.data.mouse_down = false;
    this_obj.data.mouse_up = true;
    this_obj.data.mouse_up_x = e.offsetX;
    this_obj.data.mouse_up_y = e.offsetY;
    this_obj.on_mouseup_custom(e);
  }
  on_mouseup_custom(e) { };

  on_keydown(e) {
    let this_obj = this;
    let main = this.main;

    this_obj.data.key_down[e.key] = true;
    this_obj.on_keydown_custom(e);
  }
  on_keydown_custom(e) { };

  on_keyup(e) {
    let this_obj = this;
    let main = this.main;

    this_obj.data.key_down[e.key] = false;
    this_obj.on_keyup_custom(e);
  }
  on_keyup_custom(e) { };

  touchToMouseEvent(e, isEnd) {
    let touch = isEnd ? e.changedTouches[0] : e.touches[0];
    let canvas = this.main.model.data.html.canvas;
    let rect = canvas.getBoundingClientRect();
    return {
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
  }
}
export default Event;