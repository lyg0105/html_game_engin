class UIArea {
  main;
  button_arr = [
    {
      name: "start", text: "시작", x: 100, y: 100, width: 200, height: 50,
    },
    {
      name: "select_char", text: "캐릭터", x: 100, y: 100, width: 200, height: 50,
    },
    {
      name: "select_stage", text: "스테이지", x: 100, y: 100, width: 200, height: 50,
    },
    {
      name: "select_position", text: "포메이션", x: 100, y: 100, width: 200, height: 50,
    },
    {
      name: "back", text: "뒤로", x: 100, y: 100, width: 200, height: 50,
    },
  ];
  constructor(main) {
    this.main = main;
    this.init();
  }
  init() {
    let this_obj = this;
    let main = this.main;

    let page_obj = main.model.data.page_obj;
    page_obj.data.buttons = [];
    let btn_index = 0;
    let init_btn_y = 0;
    let btn_gap = 20;
    if (this_obj.button_arr.length > 0) {
      init_btn_y = this_obj.button_arr[0].y;
    }

    this_obj.button_arr.forEach(function (button_data) {
      //x는 화면 가운데
      let canvas_w = main.model.data.canvas.width;
      button_data.x = canvas_w / 2 - button_data.width / 2;

      //y는 init_btn_y에서 시작해서 버튼 높이+gap만큼 증가
      button_data.y = init_btn_y + (button_data.height + btn_gap) * btn_index;
      if (button_data.name == "start") {
        button_data.on_click = function () {
          main.control.set_page_state({ state: "game", is_render: true });
        };
      }else if (button_data.name == "select_char") {
        button_data.on_click = function () {
          main.control.set_page_state({ state: "select_char", is_render: true });
        };
      } else if (button_data.name == "select_stage") {
        button_data.on_click = function () {
          main.control.set_page_state({ state: "select_stage", is_render: true });
        };
      } else if (button_data.name == "select_position") {
        button_data.on_click = function () {
          main.control.set_page_state({ state: "select_position", is_render: true });
        };
      } else if (button_data.name == "back") {
        button_data.on_click = function () {
          main.control.set_page_state({ state: "lobby", is_render: true });
        };
      }

      let button = new main.model.data.object.common.button.basic(button_data);
      page_obj.data.buttons.push(button);

      btn_index++;
    });
  }
}
export default UIArea;
