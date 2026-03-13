import Event from "./event/index.js";

class Control {
  main;
  event;
  constructor(main) {
    this.main = main;
    this.event = new Event(main);
  }
  init() {
    this.event.init();
  }

  start() {
    let this_obj = this;
    let main = this.main;

    this_obj.set_page_state({state:"lobby"});
  }

  set_page_state(inData) {
    let opt_obj={
      state:"lobby",
      is_render:true,
      ...inData
    };
    let this_obj = this;
    let main = this.main;
    let state=opt_obj.state;
    main.model.data.page_state = opt_obj.state;

    if(main.model.data.object[state]){
      main.model.data.page_obj = main.model.data.object[state];
      main.model.data.page_obj.init();
    }
    
    if (opt_obj.is_render) {
      main.view.render();
    }
  }
}
export default Control;