class Load {
  main;
  constructor(main) {
    this.main = main;
  }
  init() {
    let main = this.main;
    let char_arr_str = localStorage.getItem('hero_ceo_char_arr');
    if (char_arr_str) {
      try {
        let char_arr = JSON.parse(char_arr_str);
        if (Array.isArray(char_arr)) {
          main.model.data.game_data.char_arr = char_arr;
        }
      } catch (e) {}
    }
    let select_char_arr_str = localStorage.getItem('hero_ceo_select_char_arr');
    if (select_char_arr_str) {
      try {
        let select_char_arr = JSON.parse(select_char_arr_str);
        if (Array.isArray(select_char_arr)) {
          main.model.data.game_data.select_char_arr = select_char_arr;
        }
      } catch (e) {}
    }
    let select_stage_id = localStorage.getItem('hero_ceo_select_stage_id');
    if (select_stage_id) {
      let stage_list = main.model.data.object.common.char.data.stage_list;
      let found = stage_list.stage_arr.find(function(s){ return String(s.id) === select_stage_id; });
      if (found) main.model.data.game_data.select_stage = found;
    }
    let gold_str = localStorage.getItem('hero_ceo_gold');
    if (gold_str !== null) {
      let gold = parseInt(gold_str, 10);
      if (!isNaN(gold)) main.model.data.game_data.gold = gold;
    }
  }
}
export default Load;