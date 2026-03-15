class UIArea {
  main;
  init_btn_y=0;
  data = {
    buttons: [],
  };
  button_arr = [
    {
      name:"close", text: "뒤로", x: 100, y: 0, width: 200, height: 50
    },
  ];
  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;

    let option = main.model.data.page_obj;
    this_obj.data.buttons =  [];
    let btn_index=0;
    let init_btn_y=this_obj.init_btn_y;

    let btn_gap=20;
    if(this_obj.button_arr.length>0){
      init_btn_y=init_btn_y+this_obj.button_arr[0].y;
    }
    this_obj.button_arr.forEach(function (button_data) {
      //x는 화면 가운데
      let canvas_w=main.model.data.canvas.width;
      button_data.x=canvas_w/2-button_data.width/2;

      //y는 init_btn_y에서 시작해서 버튼 높이+gap만큼 증가
      button_data.y=init_btn_y+(button_data.height+btn_gap);
      init_btn_y=button_data.y;

      if(button_data.name=="close"){
        button_data.on_click=function(){
          main.control.set_page_state({state:"lobby", is_render:true});
        };
      }

      let button = new main.model.data.object.common.button.basic(button_data);
      this_obj.data.buttons.push(button);

      btn_index++;
    });
    this_obj.init_btn_y=init_btn_y;
  }
}
export default UIArea;
