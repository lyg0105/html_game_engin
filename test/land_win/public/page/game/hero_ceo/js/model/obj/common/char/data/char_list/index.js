class CharListData {
  default_char = {
    id: "",
    name: "",
    level:1,
    w: 30,
    h: 50,
    hp: 100,
    mp: 100,
    attack: 10,
    defense: 5,
    attack_speed: 1,
    attack_range:1,
    attack_type:"one",//melee,splash,explode,missile
    attack_element:"physics",//physics,fire,ice,poison,elect
    critical_per:0,
    critical_dam:1.5,
    move_speed: 1,
    job:"",
    race:"",
    left_right:"right",
    up_down:"up",
    sprite:"hero",
    state:"idle",//move,attack
    state_num:0,
    state_max_num:0,
  };
  sprite_data={
    hero:{
      w:24,
      h:24,
      walk:[
        {x:0,y:0},
        {x:1,y:0},
        {x:2,y:0},
        {x:3,y:0},
        {x:4,y:0},
        {x:5,y:0}
      ],
      attack:[
        {x:0,y:1},
        {x:1,y:1},
        {x:2,y:1},
      ],
      idle:[
        {x:0,y:2},
      ],
    },
  };
  random_name_arr=["알렉스","브라이언","크리스","데이비드","에밀리","프랭크","그레이스","헨리","아이리스","제이슨","케이트","루크","미아","노아",
    "올리비아","피터","퀸","라이언","소피아","토마스","유나",
    "벤자민","클로이","다니엘","에바","가브리엘","하나","이안","줄리아","케빈","라일라",
    "매튜","니콜","올리버","펠리시아","퀸시","레오","사라","테오","우나","빅터",
    "윈스턴","자스민","조슈아","카일","라라","마이클","네이선","올가","폴","퀸틴",
    "레이첼","스티븐","티파니","유진","브랜든","캐롤라인","데릭","에리카","프레드릭","지젤",
    "헨리","아이리스","제이슨","케이트","루크","미아","노아","올리비아","피터","퀸",
    "라이언","소피아","토마스","유나"];
  job_arr=["전사","마법사","힐러","야만인","흑마법사","소환사","궁수","드루이드","사냥꾼","주술사","농부"];
  race_arr=["인간","엘프","드워프","오크","고블린","언데드","천사","악마","용","늑대인간"];
  race_gold = { "드래곤": 3, "트롤": 2, "오크": 1.5, "사슴": 0.8 };
  char_arr = [];
  constructor() {
    let this_obj = this;
    this_obj.init();
  }
  init() {
    let this_obj = this;
    let main=this_obj.main;
    let job_arr=this_obj.job_arr;
    let race_arr=this_obj.race_arr;
    for(let i=0;i<80;i++){
      let char_name=this_obj.random_name_arr[Math.floor(Math.random()*this_obj.random_name_arr.length)];
      let job=job_arr[i % job_arr.length];
      let race=race_arr[i % race_arr.length];
      this_obj.char_arr.push({
        ...this_obj.default_char,
        id: `char_${i+1}`,
        name: char_name,
        job: job,
        race: race,
      });
    }
  }
}
export default CharListData;