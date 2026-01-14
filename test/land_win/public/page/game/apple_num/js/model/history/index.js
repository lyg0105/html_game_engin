class History {
  main;
  data = {
    hoverItem: null,
    scrollOffset: 0,
    itemHeight: 50,
    maxVisible: 8
  };
  constructor(main) {
    this.main = main;
  }
  setHoverItem(itemId) {
    this.data.hoverItem = itemId;
  }
  getItemAt(x, y) {
    const canvasData = this.main.model.data.canvas;
    const list = this.main.model.data.game_score_list;
    const startY = 120;
    const itemHeight = this.data.itemHeight;
    const itemWidth = 500;
    const startX = (canvasData.width - itemWidth) / 2;

    // 뒤로가기 버튼
    if (x >= 20 && x <= 100 && y >= 20 && y <= 60) {
      return { id: 'back', type: 'button' };
    }

    // 리스트 아이템
    for (let i = 0; i < Math.min(list.length, this.data.maxVisible); i++) {
      const itemY = startY + i * itemHeight;
      if (x >= startX && x <= startX + itemWidth &&
          y >= itemY && y <= itemY + itemHeight - 5) {
        return { id: i, type: 'item' };
      }
    }
    return null;
  }
  render() {
    const data = this.main.model.data;
    const ctx = data.html.ctx;
    const canvasData = data.canvas;
    const list = data.game_score_list;

    // 타이틀
    ctx.fillStyle = '#e94560';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('기록 확인', canvasData.width / 2, 60);

    // 뒤로가기 버튼
    const isBackHover = this.data.hoverItem === 'back';
    ctx.fillStyle = isBackHover ? '#e94560' : '#0f3460';
    ctx.beginPath();
    ctx.roundRect(20, 20, 80, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('뒤로', 60, 40);

    // 리스트
    const startY = 120;
    const itemHeight = this.data.itemHeight;
    const itemWidth = 500;
    const startX = (canvasData.width - itemWidth) / 2;

    if (list.length === 0) {
      ctx.fillStyle = '#888';
      ctx.font = '20px Arial';
      ctx.fillText('기록이 없습니다.', canvasData.width / 2, canvasData.height / 2);
      return;
    }

    // 헤더
    ctx.fillStyle = '#0f3460';
    ctx.beginPath();
    ctx.roundRect(startX, startY - 40, itemWidth, 35, 5);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('순위', startX + 30, startY - 22);
    ctx.fillText('개수', startX + 90, startY - 22);
    ctx.fillText('점수', startX + 190, startY - 22);
    ctx.fillText('시간', startX + 290, startY - 22);
    ctx.fillText('날짜', startX + 400, startY - 22);

    // 아이템들
    for (let i = 0; i < Math.min(list.length, this.data.maxVisible); i++) {
      const item = list[i];
      const itemY = startY + i * itemHeight;
      const isHover = this.data.hoverItem === i;

      // 배경
      ctx.fillStyle = isHover ? '#2a2a4a' : (i % 2 === 0 ? '#1a1a2e' : '#252542');
      ctx.beginPath();
      ctx.roundRect(startX, itemY, itemWidth, itemHeight - 5, 5);
      ctx.fill();

      // 텍스트
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(i + 1, startX + 30, itemY + itemHeight / 2 - 2);
      ctx.fillText(item.correct || 0, startX + 90, itemY + itemHeight / 2 - 2);
      ctx.fillText(item.score, startX + 190, itemY + itemHeight / 2 - 2);
      ctx.fillText(item.time_sec + '초', startX + 290, itemY + itemHeight / 2 - 2);
      ctx.fillText(item.date.substring(0, 10), startX + 400, itemY + itemHeight / 2 - 2);
    }

    // 총 기록 수
    if (list.length > this.data.maxVisible) {
      ctx.fillStyle = '#888';
      ctx.font = '14px Arial';
      ctx.fillText(`총 ${list.length}개의 기록`, canvasData.width / 2, canvasData.height - 30);
    }
  }
}
export default History;
