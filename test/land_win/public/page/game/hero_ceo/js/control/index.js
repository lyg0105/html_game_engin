import Event from "./event/index.js";
import Route from "./route/index.js";
import Load from "./load/index.js";
import Save from "./save/index.js";

class Control {
  main;
  event;
  route;
  load;
  save;
  constructor(main) {
    this.main = main;
    this.event = new Event(main);
    this.route = new Route(main);
    this.load = new Load(main);
    this.save = new Save(main);
  }
  init() {
    this.event.init();
    this.load.init();
  }

  start() {
    this.set_page_state({ state: "lobby" });
  }

  set_page_state(inData) {
    this.route.set_page_state(inData);
  }
}
export default Control;