class View {
  main;
  constructor(main) {
    this.main = main;
  }
  init(){
    this.createCanvas();
  }
  createCanvas(){
    const data = this.main.model.data;
    const canvas = document.createElement('canvas');
    canvas.width = data.canvas.width;
    canvas.height = data.canvas.height;
    data.html.app.appendChild(canvas);
    data.html.canvas = canvas;
    data.html.ctx = canvas.getContext('2d');
  }
  render() {
    const data = this.main.model.data;
    const ctx = data.html.ctx;

    // 배경 클리어
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, data.canvas.width, data.canvas.height);

    switch(data.screen){
      case 'menu':
        this.renderMenu();
        break;
      case 'game':
        this.renderGame();
        break;
      case 'record':
        this.renderRecord();
        break;
      case 'setting':
        this.renderSetting();
        break;
    }
  }
  renderMenu(){
    this.main.model.lobby.render();
  }
  renderGame(){
    this.main.model.game.render();
  }
  renderRecord(){
    this.main.model.history.render();
  }
  renderSetting(){
    this.main.model.option.render();
  }
}
export default View;