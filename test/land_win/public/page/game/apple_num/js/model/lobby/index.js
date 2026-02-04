class Lobby {
  main;
  data = {
    buttons: [
      { id: 'start', text: '시작', y: 250 },
      { id: 'record', text: '기록확인', y: 330 },
      { id: 'setting', text: '설정', y: 410 }
    ],
    buttonWidth: 200,
    buttonHeight: 60,
    hoverButton: null
  };
  constructor(main) {
    this.main = main;
  }
  setHoverButton(buttonId) {
    this.data.hoverButton = buttonId;
  }
  getButtonAt(x, y) {
    const canvasData = this.main.model.data.canvas;
    const { buttons, buttonWidth, buttonHeight } = this.data;
    const centerX = canvasData.width / 2;

    for (const btn of buttons) {
      const btnX = centerX - buttonWidth / 2;
      if (x >= btnX && x <= btnX + buttonWidth &&
          y >= btn.y && y <= btn.y + buttonHeight) {
        return btn;
      }
    }
    return null;
  }
  render() {
    const data = this.main.model.data;
    const ctx = data.html.ctx;
    const centerX = data.canvas.width / 2;

    // 타이틀
    ctx.fillStyle = '#e94560';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('사과게임', centerX, 120);

    // 버튼 그리기
    const { buttons, buttonWidth, buttonHeight, hoverButton } = this.data;

    buttons.forEach(btn => {
      const x = centerX - buttonWidth / 2;
      const isHover = hoverButton === btn.id;

      // 버튼 배경
      ctx.fillStyle = isHover ? '#e94560' : '#0f3460';
      ctx.beginPath();
      ctx.roundRect(x, btn.y, buttonWidth, buttonHeight, 10);
      ctx.fill();

      // 버튼 테두리
      ctx.strokeStyle = '#e94560';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 버튼 텍스트
      ctx.fillStyle = isHover ? '#fff' : '#eee';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(btn.text, centerX, btn.y + buttonHeight / 2);
    });
  }
}
export default Lobby;
