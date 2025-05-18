import GameData from "./data/index.js";

class Main {
  data={};
  constructor() {
    this.init();
  }

  init() {
    this.data = new GameData().data;
    console.log('Main class initialized');
  }
}
export default Main;