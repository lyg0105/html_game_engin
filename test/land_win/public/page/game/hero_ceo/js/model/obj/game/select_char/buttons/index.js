class Buttons {
  main;
  button_arr = [
    {
      name:"select", text: "선택완료", x: 100, y: 100, width: 110, height: 50,
    },
    {
      name:"close", text: "뒤로", x: 100, y: 100, width: 110, height: 50,
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
    page_obj.data.buttons =  [];
    let btn_index=0;
    let init_btn_y=main.model.data.canvas.height-8;
    let btn_total_w=0;
    
    let btn_length=this_obj.button_arr.length;
    for(let i=0;i<this_obj.button_arr.length;i++){
      btn_total_w+=this_obj.button_arr[i].width;
    }
    
    this_obj.button_arr.forEach(function (button_data) {
      //x는 화면 가운데
      let canvas_w=main.model.data.canvas.width;
      button_data.x=canvas_w/2-((btn_length-1)-btn_index)*button_data.width;
      button_data.x+=btn_index*20;
      button_data.y=init_btn_y-button_data.height;

      if(button_data.name=="select"){
        button_data.on_click=function(){
          main.control.set_page_state({state:"select_stage", is_render:true});
        };
      }

      if(button_data.name=="close"){
        button_data.on_click=function(){
          main.control.set_page_state({state:"lobby", is_render:true});
        };
      }

      let button = new main.model.data.object.common.button.basic(button_data);
      page_obj.data.buttons.push(button);

      btn_index++;
    });
  }
}
export default Buttons;