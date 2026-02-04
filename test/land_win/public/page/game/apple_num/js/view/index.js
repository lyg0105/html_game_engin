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
    const map = data.map;

    // 화면 크기에 맞춰 캔버스 크기 조정
    const maxWidth = data.canvas.width;
    const screenWidth = window.innerWidth;
    const canvasWidth = Math.min(screenWidth - 16, maxWidth);

    // gridSize를 화면에 맞게 계산 (최대값 제한)
    const maxGridSize = 60;
    const gridSize = Math.min(Math.floor(canvasWidth / map.x), maxGridSize);

    // 캔버스 높이 계산 (게임 그리드 + 상단 여백, 최소 높이 보장)
    const canvasHeight = Math.max(gridSize * map.y + 100, data.canvas.height);

    data.canvas.width = canvasWidth;
    data.canvas.height = canvasHeight;
    data.object.game.data.gridSize = gridSize;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
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