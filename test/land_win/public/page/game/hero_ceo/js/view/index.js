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

    let minWidth = 300;
    let minHeight = 300;
    // 화면 크기에 맞춰 캔버스 크기 조정
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const canvasWidth = Math.max(minWidth, screenWidth);
    const canvasHeight = Math.max(minHeight, screenHeight);

    data.canvas.width = canvasWidth;
    data.canvas.height = canvasHeight;

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
  }
}
export default View;