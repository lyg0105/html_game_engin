class Control {
  main;
  constructor(main) {
    this.main = main;
  }
  init(){
    this.bindEvents();
  }
  bindEvents(){
    const data = this.main.model.data;
    const canvas = data.html.canvas;

    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    canvas.addEventListener('click', (e) => this.onClick(e));
  }
  onMouseMove(e){
    const data = this.main.model.data;
    const rect = data.html.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if(data.screen === 'menu'){
      const lobby = this.main.model.lobby;
      const hoveredBtn = lobby.getButtonAt(x, y);
      lobby.setHoverButton(hoveredBtn ? hoveredBtn.id : null);
      data.html.canvas.style.cursor = hoveredBtn ? 'pointer' : 'default';
    } else if(data.screen === 'setting'){
      const option = this.main.model.option;
      const hoveredItem = option.getItemAt(x, y);
      option.setHoverItem(hoveredItem ? hoveredItem.id : null);
      data.html.canvas.style.cursor = hoveredItem ? 'pointer' : 'default';
    } else if(data.screen === 'record'){
      const history = this.main.model.history;
      const hoveredItem = history.getItemAt(x, y);
      history.setHoverItem(hoveredItem ? hoveredItem.id : null);
      data.html.canvas.style.cursor = hoveredItem ? 'pointer' : 'default';
    } else if(data.screen === 'game'){
      const game = this.main.model.game;
      // 팝업이 열려있으면 팝업 버튼만 체크
      if (game.data.showEndPopup) {
        const popupBtn = game.getEndPopupButtonAt(x, y);
        game.setHoverEndButton(popupBtn ? popupBtn.id : null);
        data.html.canvas.style.cursor = popupBtn ? 'pointer' : 'default';
      } else {
        const apple = game.getAppleAt(x, y);
        const isBack = game.isBackButtonAt(x, y);
        const isFinish = game.isFinishButtonAt(x, y);
        game.setHoverFinishButton(isFinish);
        data.html.canvas.style.cursor = (apple || isBack || isFinish) ? 'pointer' : 'default';
      }
    }
    this.main.view.render();
  }
  onClick(e){
    const data = this.main.model.data;
    const rect = data.html.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if(data.screen === 'menu'){
      const clickedBtn = this.main.model.lobby.getButtonAt(x, y);
      if(clickedBtn){
        this.onMenuButtonClick(clickedBtn.id);
      }
    } else if(data.screen === 'setting'){
      const clickedItem = this.main.model.option.getItemAt(x, y);
      if(clickedItem){
        this.onOptionItemClick(clickedItem);
      }
    } else if(data.screen === 'record'){
      const clickedItem = this.main.model.history.getItemAt(x, y);
      if(clickedItem && clickedItem.id === 'back'){
        this.main.model.setScreen('menu');
        this.main.view.render();
      }
    } else if(data.screen === 'game'){
      const game = this.main.model.game;
      // 팝업이 열려있으면 팝업 버튼만 체크
      if (game.data.showEndPopup) {
        const popupBtn = game.getEndPopupButtonAt(x, y);
        if (popupBtn) {
          if (popupBtn.id === 'retry') {
            game.init();
          } else if (popupBtn.id === 'back') {
            game.stop();
            this.main.model.setScreen('menu');
          }
          this.main.view.render();
        }
      } else {
        if(game.isBackButtonAt(x, y)){
          game.stop();
          this.main.model.setScreen('menu');
          this.main.view.render();
        } else if(game.isFinishButtonAt(x, y)){
          game.endGame();
        } else {
          const apple = game.getAppleAt(x, y);
          if(apple){
            game.selectApple(apple.x, apple.y);
            this.main.view.render();
          }
        }
      }
    }
  }
  onMenuButtonClick(buttonId){
    switch(buttonId){
      case 'start':
        this.main.model.setScreen('game');
        this.main.model.game.init();
        break;
      case 'record':
        this.main.model.setScreen('record');
        break;
      case 'setting':
        this.main.model.setScreen('setting');
        break;
    }
    this.main.view.render();
  }
  onOptionItemClick(item){
    const option = this.main.model.option;
    if(item.type === 'toggle'){
      option.toggleOption(item.key);
    } else if(item.id === 'back'){
      this.main.model.setScreen('menu');
    }
    this.main.view.render();
  }
  start() {
    this.main.view.render();
  }
}
export default Control;