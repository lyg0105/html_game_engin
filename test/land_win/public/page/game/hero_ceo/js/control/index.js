class Control {
  main;
  constructor(main) {
    this.main = main;
  }
  init() {
    
  }
  
  start() {
    this.main.view.render();
  }
}
export default Control;