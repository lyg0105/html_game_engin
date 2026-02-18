class CharListData {
  default_char = {
    id: "",
    name: "",
    w: 30,
    h: 50,
    hp: 100,
    mp: 100,
    attack: 10,
    defense: 5,
    attack_speed: 1,
    move_speed: 1,
  };
  char_arr = [];
  constructor() {
    let this_obj = this;
    this_obj.init();
  }
  init() {
    let this_obj = this;
    this_obj.char_arr.push({
      ...this_obj.default_char,
      id: "char_1",
      name:"전사",
    });
    this_obj.char_arr.push({
      ...this_obj.default_char,
      id: "char_2",
      name:"마법사",
    });
    this_obj.char_arr.push({
      ...this_obj.default_char,
      id: "char_3",
      name:"힐러",
    });
    this_obj.char_arr.push({
      ...this_obj.default_char,
      id: "char_4",
      name:"야만인",
    });
    this_obj.char_arr.push({
      ...this_obj.default_char,
      id: "char_5",
      name:"흑마법사",
    });
    this_obj.char_arr.push({
      ...this_obj.default_char,
      id: "char_6",
      name:"소환사",
    });
    this_obj.char_arr.push({
      ...this_obj.default_char,
      id: "char_7",
      name:"궁수",
    });
    this_obj.char_arr.push({
      ...this_obj.default_char,
      id: "char_8",
      name:"드루이드",
    });
  }
}
export default CharListData;