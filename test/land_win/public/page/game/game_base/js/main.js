import Control from './control/index.js';
import Model from './model/index.js';
import View from './view/index.js';

class Main {
  control;
  model;
  view;
  constructor() {
    this.model = new Model(this);
    this.view = new View(this);
    this.control = new Control(this);
  }
  init() {
    this.model.init();
    this.view.init();
    this.control.init();
  }
  start() {
    this.control.start();
  }
}
export default Main;