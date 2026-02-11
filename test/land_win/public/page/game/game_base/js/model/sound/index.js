class Sound {
  main;
  sound_src_json = {

  };
  sound_json = {

  };
  constructor(inData) {
    let opt_obj = {
      main: null,
      ...inData
    };
    this.main = opt_obj.main;
    this.init();
  }
  init() {
    let this_obj = this;
    let main = this.main;
    let res_div = this_obj.main.model.data.html.res_div;
    for (let key in this.sound_src_json) {
      let audio_ele = document.createElement("audio");
      audio_ele.src = this.sound_src_json[key];
      res_div.appendChild(audio_ele);
      this.sound_json[key] = audio_ele;
    }
  }

  play(inData) {
    let this_obj = this;
    let main = this.main;
    let opt_obj = {
      name: "",
      is_bgm: false,
      ...inData,
    };

    if (opt_obj.is_bgm) {
      if (main.model.data.is_background_sound == false) {
        return false;
      }
    } else {
      if (main.model.data.is_game_sound == false) {
        return false;
      }
    }


    let name = opt_obj.name;
    if (this.sound_json[name]) {
      this.sound_json[name].currentTime = 0;
      this_obj.sound_json[name].volume = main.model.data.sound_volume;
      if (opt_obj.is_bgm) {
        this_obj.sound_json[name].volume = main.model.data.bgm_volume;
      }
      this.sound_json[name].play();
    }
  }
  stop(inData) {
    let this_obj = this;
    let main = this.main;
    let opt_obj = {
      name: "",
      ...inData,
    };
    let name = opt_obj.name;
    if (this.sound_json[name]) {
      this.sound_json[name].pause();
      this.sound_json[name].currentTime = 0;
    }
  }
}
export default Sound;