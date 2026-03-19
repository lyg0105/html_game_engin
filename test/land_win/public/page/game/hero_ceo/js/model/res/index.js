class Resource {
  main;
  img_json = {
    hero:"/page/game/hero_ceo/img/hero/hero144png.png",
  };
  img = {};
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
    let main = this_obj.main;
    let res_div = main.model.data.html.res_div;
    res_div.innerHTML = '';
    for (let key in this_obj.img_json) {
      let img = new Image();
      img.src = this_obj.img_json[key];
      res_div.appendChild(img);
      this_obj.img[key] = img;
    }
  }
}
export default Resource;