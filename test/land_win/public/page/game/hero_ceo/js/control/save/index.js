class Save {
  main;
  constructor(main) {
    this.main = main;
  }
  save() {
    let main = this.main;
    let game_data = main.model.data.game_data;
    localStorage.setItem('hero_ceo_char_arr', JSON.stringify(game_data.char_arr));
    localStorage.setItem('hero_ceo_select_char_arr', JSON.stringify(game_data.select_char_arr));
    if (game_data.select_stage) {
      localStorage.setItem('hero_ceo_select_stage_id', String(game_data.select_stage.id));
    }
    localStorage.setItem('hero_ceo_gold', String(game_data.gold));
  }
}
export default Save;