class Game {
  main;
  data = {
    apples: [],
    gridSize: 50,
    selected: [],
    score: 0,
    timeLeft: 60,
    timerInterval: null,
    isPlaying: false,
    showEndPopup: false,
    endPopupButtons: [
      { id: 'retry', text: '다시하기', y: 0 },
      { id: 'back', text: '뒤로가기', y: 0 }
    ],
    hoverEndButton: null,
    isOvertime: false,
    hoverFinishButton: false,
    startTime: 0,
    elapsedMs: 0
  };
  constructor(main) {
    this.main = main;
  }
  init() {
    this.generateApples();
    this.data.score = 0;
    this.main.model.data.correct = 0;
    this.data.timeLeft = this.main.model.data.limit_sec;
    this.data.selected = [];
    this.data.isPlaying = true;
    this.data.showEndPopup = false;
    this.data.hoverEndButton = null;
    this.data.isOvertime = false;
    this.data.hoverFinishButton = false;
    this.data.startTime = Date.now();
    this.data.elapsedMs = 0;
    this.startTimer();
  }
  generateApples() {
    const map = this.main.model.data.map;
    this.data.apples = [];
    for (let y = 0; y < map.y; y++) {
      const row = [];
      for (let x = 0; x < map.x; x++) {
        row.push({
          value: Math.floor(Math.random() * 9) + 1,
          x: x,
          y: y,
          selected: false
        });
      }
      this.data.apples.push(row);
    }
  }
  startTimer() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
    this.data.timerInterval = setInterval(() => {
      this.data.timeLeft--;
      if (this.data.timeLeft <= 0) {
        this.data.isOvertime = true;
        this.endGame();
        return;
      }
      this.main.view.render();
    }, 1000);
  }
  endGame() {
    this.data.isPlaying = false;
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
      this.data.timerInterval = null;
    }

    // 경과 시간 계산 (초 단위, 소수점 1자리)
    this.data.elapsedMs = Date.now() - this.data.startTime;
    const elapsedSec = this.data.elapsedMs / 1000;

    // 제한시간 내에 완료했으면 점수 두 배
    const baseScore = this.data.score;

    // 최종 점수 = (점수 / 경과시간) * 100 (소수점 1자리)
    const finalScore = elapsedSec > 0 ? parseFloat(((baseScore / elapsedSec) * 100).toFixed(1)) : baseScore * 100;

    this.main.model.data.score = finalScore;
    this.data.showEndPopup = true;

    // 기록 추가
    const now = new Date();
    const dateStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    const scoreRow = {
      name: this.main.model.data.name,
      correct: this.data.score,
      score: finalScore,
      time_sec: parseFloat(elapsedSec.toFixed(1)),
      date: dateStr
    };
    this.main.model.data.game_score_list.unshift(scoreRow);
    this.main.model.history.saveScoreAtServer({
      score_row_arr: [scoreRow],
    });

    this.main.view.render();
  }
  selectApple(x, y) {
    if (!this.data.isPlaying) return;
    const apple = this.data.apples[y][x];
    if (!apple || apple.value === 0) return;

    const selectedIndex = this.data.selected.findIndex(
      s => s.x === x && s.y === y
    );

    if (selectedIndex !== -1) {
      // 이미 선택됨 -> 선택 해제
      apple.selected = false;
      this.data.selected.splice(selectedIndex, 1);
    } else {
      // 새로 선택
      apple.selected = true;
      this.data.selected.push({ x, y, value: apple.value });
    }

    // 합계 확인
    this.checkSum();
  }
  checkSum() {
    const sum = this.data.selected.reduce((acc, s) => acc + s.value, 0);
    if (sum === 10) {
      // 맞춤! 사과 제거
      this.data.selected.forEach(s => {
        this.data.apples[s.y][s.x].value = 0;
        this.data.apples[s.y][s.x].selected = false;
      });
      this.data.score += this.data.selected.length;
      this.main.model.data.correct += 1; // 맞춘 개수 증가
      this.data.selected = [];

      // 모든 사과를 없앴는지 확인
      if (this.areAllApplesGone()) {
        this.endGame();
      }
    } else if (sum > 10) {
      // 초과 -> 선택 초기화
      this.data.selected.forEach(s => {
        this.data.apples[s.y][s.x].selected = false;
      });
      this.data.selected = [];
    }
  }
  areAllApplesGone() {
    for (let y = 0; y < this.data.apples.length; y++) {
      for (let x = 0; x < this.data.apples[y].length; x++) {
        if (this.data.apples[y][x].value > 0) {
          return false;
        }
      }
    }
    return true;
  }
  getAppleAt(mouseX, mouseY) {
    const canvasData = this.main.model.data.canvas;
    const map = this.main.model.data.map;
    const gridSize = this.data.gridSize;

    const totalWidth = map.x * gridSize;
    const totalHeight = map.y * gridSize;
    const startX = (canvasData.width - totalWidth) / 2;
    const startY = 80;

    const gridX = Math.floor((mouseX - startX) / gridSize);
    const gridY = Math.floor((mouseY - startY) / gridSize);

    if (gridX >= 0 && gridX < map.x && gridY >= 0 && gridY < map.y) {
      return { x: gridX, y: gridY };
    }
    return null;
  }
  render() {
    const data = this.main.model.data;
    const ctx = data.html.ctx;
    const canvasData = data.canvas;
    const map = data.map;
    const gridSize = this.data.gridSize;

    const totalWidth = map.x * gridSize;
    const totalHeight = map.y * gridSize;
    const startX = (canvasData.width - totalWidth) / 2;
    const startY = 80;

    // 상단 정보 표시 (뒤로 버튼과 같은 줄, 오른쪽 배치)
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('점수: ' + this.data.score, canvasData.width / 2 + 20, 40);

    // 시간 표시 (제한시간 초과시 다른 색으로)
    const timeText = '시간: ' + Math.abs(this.data.timeLeft) + '초';
    ctx.fillStyle = this.data.isOvertime ? '#ff6b6b' : '#fff';
    ctx.fillText(timeText, canvasData.width / 2 + 150, 40);

    // 사과 그리드 그리기
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let y = 0; y < map.y; y++) {
      for (let x = 0; x < map.x; x++) {
        const apple = this.data.apples[y][x];
        const px = startX + x * gridSize;
        const py = startY + y * gridSize;

        if (apple.value > 0) {
          // 사과 배경
          ctx.fillStyle = apple.selected ? '#e94560' : '#2d4a3e';
          ctx.beginPath();
          ctx.arc(px + gridSize / 2, py + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
          ctx.fill();

          // 숫자 (gridSize에 비례하여 폰트 크기 조정)
          ctx.fillStyle = '#fff';
          const fontSize = Math.max(Math.round(gridSize * 0.34), 12);
          ctx.font = 'bold ' + fontSize + 'px Arial';
          ctx.fillText(apple.value, px + gridSize / 2, py + gridSize / 2);
        }
      }
    }

    // 뒤로가기 버튼 (상단 좌측)
    ctx.fillStyle = '#0f3460';
    ctx.beginPath();
    ctx.roundRect(20, 20, 80, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('뒤로', 60, 40);

    // 완료 버튼 (제한시간 초과시 상단 우측에 표시)
    if (this.data.isOvertime) {
      const finishBtnX = canvasData.width - 110;
      const finishBtnY = 20;
      const finishBtnWidth = 90;
      const finishBtnHeight = 40;

      ctx.fillStyle = this.data.hoverFinishButton ? '#e94560' : '#16a085';
      ctx.beginPath();
      ctx.roundRect(finishBtnX, finishBtnY, finishBtnWidth, finishBtnHeight, 8);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('완료', finishBtnX + finishBtnWidth / 2, finishBtnY + finishBtnHeight / 2);
    }

    // 게임 종료 팝업
    if (this.data.showEndPopup) {
      this.renderEndPopup();
    }
  }
  renderEndPopup() {
    const data = this.main.model.data;
    const ctx = data.html.ctx;
    const canvasData = data.canvas;

    // 반투명 배경
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvasData.width, canvasData.height);

    // 팝업 박스
    const popupWidth = 320;
    const popupHeight = this.data.isOvertime ? 290 : 330;
    const popupX = (canvasData.width - popupWidth) / 2;
    const popupY = (canvasData.height - popupHeight) / 2;

    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.roundRect(popupX, popupY, popupWidth, popupHeight, 15);
    ctx.fill();

    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 게임 종료 텍스트
    ctx.fillStyle = '#e94560';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('게임 종료!', canvasData.width / 2, popupY + 45);

    // 경과 시간 표시
    const elapsedSec = (this.data.elapsedMs / 1000).toFixed(1);
    ctx.fillStyle = '#87ceeb';
    ctx.font = '16px Arial';
    ctx.fillText('경과 시간: ' + elapsedSec + '초', canvasData.width / 2, popupY + 85);

    // 획득 점수 표시
    const baseScore = this.data.isOvertime ? this.data.score : this.data.score * 2;
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.fillText('획득 점수: ' + baseScore, canvasData.width / 2, popupY + 115);

    // 최종 점수 표시
    const finalScore = data.score;
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 26px Arial';
    ctx.fillText('최종 점수: ' + finalScore, canvasData.width / 2, popupY + 150);

    // 제한시간 내 완료 보너스 표시
    if (!this.data.isOvertime) {
      ctx.fillStyle = '#4caf50';
      ctx.font = 'bold 15px Arial';
      ctx.fillText('⭐ 제한시간 내 완료!', canvasData.width / 2, popupY + 185);
      ctx.fillStyle = '#87ceeb';
      ctx.font = '13px Arial';
      ctx.fillText('보너스 점수 x2 적용', canvasData.width / 2, popupY + 205);
    }

    // 버튼들
    const buttonWidth = 120;
    const buttonHeight = 45;
    const buttonGap = 20;
    const buttonsStartY = this.data.isOvertime ? popupY + 200 : popupY + 240;

    this.data.endPopupButtons.forEach((btn, index) => {
      const btnX = canvasData.width / 2 - buttonWidth - buttonGap / 2 + index * (buttonWidth + buttonGap);
      const btnY = buttonsStartY;
      btn.x = btnX;
      btn.y = btnY;

      const isHover = this.data.hoverEndButton === btn.id;

      ctx.fillStyle = isHover ? '#e94560' : '#0f3460';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, buttonWidth, buttonHeight, 8);
      ctx.fill();

      ctx.strokeStyle = '#e94560';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(btn.text, btnX + buttonWidth / 2, btnY + buttonHeight / 2);
    });
  }
  isBackButtonAt(x, y) {
    return x >= 20 && x <= 100 && y >= 20 && y <= 60;
  }
  isFinishButtonAt(x, y) {
    if (!this.data.isOvertime) return false;
    const canvasData = this.main.model.data.canvas;
    const finishBtnX = canvasData.width - 110;
    const finishBtnY = 20;
    const finishBtnWidth = 90;
    const finishBtnHeight = 40;
    return x >= finishBtnX && x <= finishBtnX + finishBtnWidth &&
           y >= finishBtnY && y <= finishBtnY + finishBtnHeight;
  }
  setHoverFinishButton(isHover) {
    this.data.hoverFinishButton = isHover;
  }
  getEndPopupButtonAt(x, y) {
    if (!this.data.showEndPopup) return null;
    const buttonWidth = 120;
    const buttonHeight = 45;
    for (const btn of this.data.endPopupButtons) {
      if (x >= btn.x && x <= btn.x + buttonWidth &&
          y >= btn.y && y <= btn.y + buttonHeight) {
        return btn;
      }
    }
    return null;
  }
  setHoverEndButton(buttonId) {
    this.data.hoverEndButton = buttonId;
  }
  stop() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
      this.data.timerInterval = null;
    }
    this.data.isPlaying = false;
  }
}
export default Game;
