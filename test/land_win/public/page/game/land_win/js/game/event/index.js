class EventMain {
  game_data = null;
  game_body = null;
  data = {
    is_mouse_down: false,
    mouse_x: 0,
    mouse_y: 0,
    mouse_up_x: 0,
    mouse_up_y: 0,
    drag_rect: { x: 0, y: 0, w: 0, h: 0 },
    key_downs: {},//{13:true,32:true}
  }
  //클릭,클릭업
  //터치,터치업
  //키보드 업,다운
  constructor(inData) {
    let opt_obj = {
      game_data: null,
      game_body: null,
      ...inData
    };
    this.game_data = opt_obj.game_data;
    this.game_body = opt_obj.game_body;
    this.init();
  }
  init() {
    let this_obj = this;
    if (navigator.maxTouchPoints == 0) {
      this.game_body.addEventListener('mousedown', (e) => {
        this_obj.on_mouse_down(e);
      });
      this.game_body.addEventListener('mouseup', (e) => {
        this_obj.on_mouse_up(e);
      });
      this.game_body.addEventListener('mousemove', (e) => {
        this_obj.on_mouse_move(e);
      });
    } else {
      this.game_body.addEventListener('touchstart', (e) => {
        this_obj.on_mouse_down(e);
      });
      this.game_body.addEventListener('touchend', (e) => {
        this_obj.on_mouse_up(e);
      });
      this.game_body.addEventListener('touchmove', (e) => {
        this_obj.on_mouse_move(e);
      });
    }

    this.game_body.addEventListener('keydown', (e) => {
      this_obj.on_key_down(e);
    });
    this.game_body.addEventListener('keyup', (e) => {
      this_obj.on_key_up(e);
    });
  }
  on_mouse_down(e) {
    let this_obj = this;
    this_obj.data.is_mouse_down = true;
    if (navigator.maxTouchPoints == 0) {
      this_obj.data.mouse_x = e.clientX;
      this_obj.data.mouse_y = e.clientY;
      this_obj.data.drag_rect.x = e.clientX;
      this_obj.data.drag_rect.y = e.clientY;
      this_obj.data.mouse_up_x = e.clientX;
      this_obj.data.mouse_up_y = e.clientY;
    } else if (e.touches && e.touches.length > 0) {
      this_obj.data.mouse_x = e.touches[0].clientX;
      this_obj.data.mouse_y = e.touches[0].clientY;
      this_obj.data.drag_rect.x = e.touches[0].clientX;
      this_obj.data.drag_rect.y = e.touches[0].clientY;
      this_obj.data.mouse_up_x = e.touches[0].clientX;
      this_obj.data.mouse_up_y = e.touches[0].clientY;
    }
    this.on_mouse_down_custom(e);
  }
  on_mouse_down_custom(e) {

  }
  on_mouse_up(e) {
    let this_obj = this;
    this_obj.data.is_mouse_down = false;
    if (navigator.maxTouchPoints == 0) {
      this_obj.data.mouse_up_x = e.clientX;
      this_obj.data.mouse_up_y = e.clientY;
    } else {
      if (e.touches && e.touches.length > 0) {
        this_obj.data.mouse_up_x = e.touches[0].clientX;
        this_obj.data.mouse_up_y = e.touches[0].clientY;
      }
    }
    this_obj.data.drag_rect = { x: 0, y: 0, w: 0, h: 0 };
    this.on_mouse_up_custom(e);
  }
  on_mouse_up_custom(e) {

  }
  on_mouse_move(e) {
    let this_obj = this;
    if (navigator.maxTouchPoints == 0) {
      this_obj.data.mouse_up_x = e.clientX;
      this_obj.data.mouse_up_y = e.clientY;
      if (this_obj.data.is_mouse_down) {
        this_obj.data.drag_rect.w = e.clientX - this_obj.data.drag_rect.x;
        this_obj.data.drag_rect.h = e.clientY - this_obj.data.drag_rect.y;
      }
    } else if (e.touches && e.touches.length > 0) {
      this_obj.data.mouse_up_x = e.touches[0].clientX;
      this_obj.data.mouse_up_y = e.touches[0].clientY;
      if (this_obj.data.is_mouse_down) {
        this_obj.data.drag_rect.w = e.touches[0].clientX - this_obj.data.drag_rect.x;
        this_obj.data.drag_rect.h = e.touches[0].clientY - this_obj.data.drag_rect.y;
      }
    }
    this.on_mouse_move_custom(e);
  }
  on_mouse_move_custom(e) {

  }
  on_key_down(e) {
    let this_obj = this;
    this_obj.data.key_downs[e.keyCode] = true;
    this.on_key_down_custom(e);
  }
  on_key_down_custom(e) {

  }
  on_key_up(e) {
    let this_obj = this;
    delete this_obj.data.key_downs[e.keyCode];
    this.on_key_up_custom(e);
  }
  on_key_up_custom(e) {

  }
}
export default EventMain;