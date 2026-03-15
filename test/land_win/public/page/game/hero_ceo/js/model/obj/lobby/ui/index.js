class UIArea {
  main;
  button_arr = [
    {
      name: "start", text: "시작", x: 100, y: 100, width: 200, height: 50
    },
    {
      name: "shop", text: "상점", x: 100, y: 100, width: 200, height: 50
    },
    {
      name: "record", text: "기록", x: 100, y: 100, width: 200, height: 50
    },
    {
      name: "settings", text: "설정", x: 100, y: 100, width: 200, height: 50
    },
    {
      name: "close", text: "닫기", x: 100, y: 100, width: 200, height: 50
    },
  ];
  constructor(main) {
    this.main = main;
    this.init();
  }
  init() {
    let this_obj = this;
    let main = this.main;

    let lobby = main.model.data.page_obj;
    lobby.data.buttons = [];
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

      if(button_data.name == "start"){
        button_data.on_click = function () {
          main.control.set_page_state({state:"game_menu", is_render:true});
        }
      }

      if (button_data.name == "shop") {
        button_data.on_click = function () {
          main.control.set_page_state({state:"shop", is_render:true});
        };
      }

      if (button_data.name == "settings") {
        button_data.on_click = function () {
          main.control.set_page_state({state:"option", is_render:true});
        };
      }

      if (button_data.name == "close") {
        button_data.on_click = function () {
          window.location.href = main.model.data.close_url;
        };
      }

      let button = new main.model.data.object.common.button.basic(button_data);
      lobby.data.buttons.push(button);

      btn_index++;
    });
  }
}
export default UIArea;
