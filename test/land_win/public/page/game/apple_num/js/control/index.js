class Control {
  main;
  constructor(main) {
    this.main = main;
  }
  init() {
    this.bindEvents();
  }
  bindEvents() {
    const data = this.main.model.data;
    const canvas = data.html.canvas;

    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    canvas.addEventListener('click', (e) => this.onClick(e));

    // 모바일 터치 이벤트
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.onClick(touch);
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.onMouseMove(touch);
    }, { passive: false });
  }
  getCanvasPos(e) {
    const data = this.main.model.data;
    const rect = data.html.canvas.getBoundingClientRect();
    const scaleX = data.canvas.width / rect.width;
    const scaleY = data.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }
  onMouseMove(e) {
    const data = this.main.model.data;
    const { x, y } = this.getCanvasPos(e);

    if (data.screen === 'menu') {
      const lobby = this.main.model.lobby;
      const hoveredBtn = lobby.getButtonAt(x, y);
      lobby.setHoverButton(hoveredBtn ? hoveredBtn.id : null);
      data.html.canvas.style.cursor = hoveredBtn ? 'pointer' : 'default';
    } else if (data.screen === 'setting') {
      const option = this.main.model.option;
      const hoveredItem = option.getItemAt(x, y);
      option.setHoverItem(hoveredItem ? hoveredItem.id : null);
      data.html.canvas.style.cursor = hoveredItem ? 'pointer' : 'default';
    } else if (data.screen === 'record') {
      const history = this.main.model.history;
      const hoveredItem = history.getItemAt(x, y);
      history.setHoverItem(hoveredItem ? hoveredItem.id : null);
      data.html.canvas.style.cursor = hoveredItem ? 'pointer' : 'default';
    } else if (data.screen === 'game') {
      const game = this.main.model.game;
      // 팝업이 열려있으면 팝업 버튼만 체크
      if (game.data.showEndPopup) {
        const popupBtn = game.getEndPopupButtonAt(x, y);
        const isName = game.isNameAt(x, y);
        game.setHoverEndButton(popupBtn ? popupBtn.id : null);
        game.setHoverName(isName);
        data.html.canvas.style.cursor = (popupBtn || isName) ? 'pointer' : 'default';
      } else {
        const apple = game.getAppleAt(x, y);
        const isBack = game.isBackButtonAt(x, y);
        const isFinish = game.isFinishButtonAt(x, y);
        const isGameName = game.isGameNameAt(x, y);
        game.setHoverFinishButton(isFinish);
        game.setHoverGameName(isGameName);
        data.html.canvas.style.cursor = (apple || isBack || isFinish || isGameName) ? 'pointer' : 'default';
      }
    }
    this.main.view.render();
  }
  onClick(e) {
    const data = this.main.model.data;
    const { x, y } = this.getCanvasPos(e);

    if (data.screen === 'intro') {
      this.main.model.setScreen('menu');
      this.main.view.render();
      return;
    } else if (data.screen === 'menu') {
      const clickedBtn = this.main.model.lobby.getButtonAt(x, y);
      if (clickedBtn) {
        this.onMenuButtonClick(clickedBtn.id);
      }
    } else if (data.screen === 'setting') {
      const clickedItem = this.main.model.option.getItemAt(x, y);
      if (clickedItem) {
        this.onOptionItemClick(clickedItem, x, y);
      }
    } else if (data.screen === 'record') {
      const clickedItem = this.main.model.history.getItemAt(x, y);
      if (clickedItem && clickedItem.id === 'back') {
        this.main.model.setScreen('menu');
        this.main.view.render();
      } else if (clickedItem && clickedItem.id === 'prevPage') {
        let scoreListOpt = data.score_list_opt;
        if (scoreListOpt.now_page > 1) {
          scoreListOpt.now_page--;
          this.main.model.history.getScoreListAtServer({ now_page: scoreListOpt.now_page }).then(() => {
            this.main.view.render();
          });
        }
      } else if (clickedItem && clickedItem.id === 'tabRank') {
        let scoreListOpt = data.score_list_opt;
        if (scoreListOpt.list_sort !== 'rank') {
          scoreListOpt.list_sort = 'rank';
          scoreListOpt.list_my_score = '';
          scoreListOpt.now_page = 1;
          this.main.model.history.getScoreListAtServer({ now_page: 1 }).then(() => {
            this.main.view.render();
          });
        }
      } else if (clickedItem && clickedItem.id === 'tabHistory') {
        let scoreListOpt = data.score_list_opt;
        if (scoreListOpt.list_sort !== 'history' || scoreListOpt.list_my_score === '1') {
          scoreListOpt.list_sort = 'history';
          scoreListOpt.list_my_score = '';
          scoreListOpt.now_page = 1;
          this.main.model.history.getScoreListAtServer({ now_page: 1, list_sort: 'history', list_my_score: '' }).then(() => {
            this.main.view.render();
          });
        }
      } else if (clickedItem && clickedItem.id === 'tabMyHistory') {
        let scoreListOpt = data.score_list_opt;
        if (scoreListOpt.list_sort !== 'history' || scoreListOpt.list_my_score !== '1') {
          scoreListOpt.list_sort = 'history';
          scoreListOpt.list_my_score = '1';
          scoreListOpt.now_page = 1;
          this.main.model.history.getScoreListAtServer({ now_page: 1, list_sort: 'history', list_my_score: '1' }).then(() => {
            this.main.view.render();
          });
        }
      } else if (clickedItem && clickedItem.id === 'nextPage') {
        let scoreListOpt = data.score_list_opt;
        let totalCount = data.util.string.uncomma_int(data.score_count_info.tot);
        let totalPage = Math.max(1, Math.ceil(totalCount / scoreListOpt.num_per_page));
        if (scoreListOpt.now_page < totalPage) {
          scoreListOpt.now_page++;
          this.main.model.history.getScoreListAtServer({ now_page: scoreListOpt.now_page }).then(() => {
            this.main.view.render();
          });
        }
      }
    } else if (data.screen === 'game') {
      const game = this.main.model.game;
      // 팝업이 열려있으면 팝업 버튼만 체크
      if (game.data.showEndPopup) {
        if (game.isNameAt(x, y)) {
          const current = this.main.model.data.name;
          const name = prompt('이름을 입력하세요', current);
          if (name !== null) {
            this.main.model.data.name = name.trim();
            localStorage.setItem('apple_num_user_name', name.trim());
          }
          this.main.view.render();
          return;
        }
        const popupBtn = game.getEndPopupButtonAt(x, y);
        if (popupBtn) {
          if (popupBtn.id === 'retry') {
            game.init();
          } else if (popupBtn.id === 'back') {
            this.main.model.data.sound.stop({ name: "bgm" });
            this.main.model.data.sound.play({ name: "tic" });
            game.stop();
            this.main.model.setScreen('menu');
          }
          this.main.view.render();
        }
      } else {
        if (game.isBackButtonAt(x, y)) {
          this.main.model.data.sound.stop({ name: "bgm" });
          this.main.model.data.sound.play({ name: "tic" });
          game.stop();
          this.main.model.setScreen('menu');
          this.main.view.render();
        } else if (game.isGameNameAt(x, y)) {
          const current = this.main.model.data.name;
          const name = prompt('이름을 입력하세요', current);
          if (name !== null) {
            this.main.model.data.name = name.trim();
            localStorage.setItem('apple_num_user_name', name.trim());
          }
          this.main.view.render();
        } else if (game.isFinishButtonAt(x, y)) {
          this.main.model.data.sound.stop({ name: "bgm" });
          this.main.model.data.sound.play({ name: "tic" });
          game.endGame();
        } else {
          const apple = game.getAppleAt(x, y);
          if (apple) {
            game.selectApple(apple.x, apple.y);
            this.main.view.render();
          }
        }
      }
    }
  }
  async onMenuButtonClick(buttonId) {
    let main = this.main;
    this.main.model.data.sound.play({ name: "tic" });
    switch (buttonId) {
      case 'start':
        this.main.model.setScreen('game');
        this.main.model.game.init();
        break;
      case 'record':
        await this.main.model.history.getScoreListAtServer();
        this.main.model.setScreen('record');
        break;
      case 'setting':
        this.main.model.setScreen('setting');
        break;
      case 'close':
        location.href = main.model.data.close_url;
        break;
    }
    this.main.view.render();
  }
  onOptionItemClick(item, x, y) {
    this.main.model.data.sound.play({ name: "tic" });
    const option = this.main.model.option;
    if (item.type === 'input') {
      const current = this.main.model.data.name;
      const name = prompt('이름을 입력하세요', current);
      if (name !== null) {
        option.setName(name.trim());
      }
    } else if (item.type === 'toggle') {
      option.toggleOption(item.key);
    } else if (item.type === 'range') {
      const canvasData = this.main.model.data.canvas;
      const centerX = canvasData.width / 2;
      const itemX = centerX - option.data.itemWidth / 2;
      option.setVolume(item.key, x, itemX);
    } else if (item.id === 'back') {
      this.main.model.setScreen('menu');
    }
    this.main.view.render();
  }
  start() {
    this.main.view.render();
  }
}
export default Control;