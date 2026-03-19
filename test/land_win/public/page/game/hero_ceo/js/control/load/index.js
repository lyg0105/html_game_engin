class Load {
  main;
  constructor(main) {
    this.main = main;
  }
  init() {
    let main = this.main;
    let char_arr_str = localStorage.getItem('hero_ceo_char_arr');
    let default_char=main.model.data.object.common.char.data.char_list.default_char;
    if (char_arr_str) {
      try {
        let char_arr = JSON.parse(char_arr_str);
        if (Array.isArray(char_arr)) {
          for(let i=0;i<char_arr.length;i++){
            char_arr[i]={
              ...default_char,
              ...char_arr[i]
            };
          }
          main.model.data.game_data.char_arr = char_arr;
        }
      } catch (e) { }
    }
    let select_char_arr_str = localStorage.getItem('hero_ceo_select_char_arr');
    if (select_char_arr_str) {
      try {
        let select_char_arr = JSON.parse(select_char_arr_str);
        if (Array.isArray(select_char_arr)) {
          for(let i=0;i<select_char_arr.length;i++){
            select_char_arr[i]={
              ...default_char,
              ...select_char_arr[i]
            };
          }
          main.model.data.game_data.select_char_arr = select_char_arr;
        }
      } catch (e) { }
    }
    let hero_ceo_select_stage = localStorage.getItem('hero_ceo_select_stage');
    if (hero_ceo_select_stage) {
      try {
        let select_stage = JSON.parse(hero_ceo_select_stage);
        if (select_stage) {
          main.model.data.game_data.select_stage = select_stage;
        }
      } catch (e) { }
    }
    let gold_str = localStorage.getItem('hero_ceo_gold');
    if (gold_str !== null) {
      let gold = parseInt(gold_str, 10);
      if (!isNaN(gold)) main.model.data.game_data.gold = gold;
    }
  }
}
export default Load;