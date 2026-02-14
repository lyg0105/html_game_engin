class Option {
  main;
  data = {
    items: [
      { id: 'name', text: '이름 설정', type: 'input' },
      { id: 'game_sound', text: '게임 효과음', type: 'toggle', key: 'is_game_sound' },
      { id: 'sound_volume', text: '효과음 크기', type: 'range', key: 'sound_volume' },
      { id: 'bg_sound', text: '배경 음악', type: 'toggle', key: 'is_background_sound' },
      { id: 'bgm_volume', text: '배경음 크기', type: 'range', key: 'bgm_volume' },
      { id: 'back', text: '돌아가기', type: 'button' }
    ],
    itemWidth: 300,
    itemHeight: 50,
    hoverItem: null
  };
  constructor(main) {
    this.main = main;
  }
  setHoverItem(itemId) {
    this.data.hoverItem = itemId;
  }
  getItemAt(x, y) {
    const canvasData = this.main.model.data.canvas;
    const { items, itemWidth, itemHeight } = this.data;
    const centerX = canvasData.width / 2;
    const startY = 100;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemX = centerX - itemWidth / 2;
      const itemY = startY + i * (itemHeight + 20);
      if (x >= itemX && x <= itemX + itemWidth &&
          y >= itemY && y <= itemY + itemHeight) {
        return item;
      }
    }
    return null;
  }
  setName(name) {
    const data = this.main.model.data;
    data.name = name;
    localStorage.setItem('apple_num_user_name', name);
  }
  toggleOption(key) {
    const data = this.main.model.data;
    data[key] = !data[key];
    localStorage.setItem('apple_num_' + key, data[key]);
  }
  setVolume(key, x, itemX) {
    const data = this.main.model.data;
    const barX = itemX + 150;
    const barWidth = this.data.itemWidth - 170;
    let ratio = (x - barX) / barWidth;
    ratio = Math.max(0, Math.min(1, ratio));
    data[key] = Math.round(ratio * 10) / 10;
    localStorage.setItem('apple_num_' + key, data[key]);
  }
  render() {
    const data = this.main.model.data;
    const ctx = data.html.ctx;
    const centerX = data.canvas.width / 2;
    const { items, itemWidth, itemHeight, hoverItem } = this.data;
    const startY = 100;

    // 타이틀
    ctx.fillStyle = '#e94560';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚙️ 설정 ⚙️', centerX, 50);

    // 옵션 아이템 그리기
    items.forEach((item, i) => {
      const x = centerX - itemWidth / 2;
      const y = startY + i * (itemHeight + 20);
      const isHover = hoverItem === item.id;

      // 아이템 배경
      ctx.fillStyle = isHover ? '#e94560' : '#0f3460';
      ctx.beginPath();
      ctx.roundRect(x, y, itemWidth, itemHeight, 8);
      ctx.fill();

      // 아이템 테두리
      ctx.strokeStyle = '#e94560';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 아이템 텍스트
      ctx.fillStyle = isHover ? '#fff' : '#eee';
      ctx.font = 'bold 20px Arial';

      if (item.type === 'input') {
        ctx.textAlign = 'left';
        ctx.fillText(item.text, x + 20, y + itemHeight / 2);

        // 현재 이름 표시
        ctx.textAlign = 'right';
        ctx.fillStyle = data.name ? '#4ade80' : '#888';
        ctx.fillText(data.name || '미설정', x + itemWidth - 20, y + itemHeight / 2);
      } else if (item.type === 'toggle') {
        const isOn = data[item.key];
        ctx.textAlign = 'left';
        ctx.fillText(item.text, x + 20, y + itemHeight / 2);

        // 토글 상태 표시
        ctx.textAlign = 'right';
        ctx.fillStyle = isOn ? '#4ade80' : '#f87171';
        ctx.fillText(isOn ? 'ON' : 'OFF', x + itemWidth - 20, y + itemHeight / 2);
      } else if (item.type === 'range') {
        const vol = data[item.key];
        ctx.textAlign = 'left';
        ctx.fillText(item.text, x + 20, y + itemHeight / 2);

        // 볼륨 바 배경
        const barX = x + 150;
        const barY = y + itemHeight / 2 - 5;
        const barWidth = itemWidth - 170;
        const barHeight = 10;
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth, barHeight, 5);
        ctx.fill();

        // 볼륨 바 채움
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth * vol, barHeight, 5);
        ctx.fill();

        // 볼륨 핸들
        const handleX = barX + barWidth * vol;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(handleX, y + itemHeight / 2, 8, 0, Math.PI * 2);
        ctx.fill();

        // 볼륨 수치
        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(vol * 100) + '%', handleX, y + itemHeight / 2 + 18);
      } else {
        ctx.textAlign = 'center';
        ctx.fillText(item.text, centerX, y + itemHeight / 2);
      }
    });
  }
}
export default Option;
