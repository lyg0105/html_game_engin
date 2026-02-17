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

    this_obj.set_page_state("lobby");
    this.main.view.render();
  }

  set_page_state(state) {
    let this_obj = this;
    let main = this.main;
    main.model.data.page_state = state;

    if (state === "lobby") {
      main.model.data.page_obj = main.model.data.object.lobby;
      main.model.data.page_obj.init();
    }
  }
}
export default Control;