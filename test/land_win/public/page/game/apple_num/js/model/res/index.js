class Resource {
  main;
  img_json={
    apple_ico:"/page/game/apple_num/img/apple_ico.png",
  };
  constructor(inData) {
    let opt_obj = {
      main: null,
      ...inData
    };
    this.main = opt_obj.main;
    this.init();
  }
  init(){
    let this_obj = this;
    let main=this_obj.main;
    let res_div=main.model.data.html.res_div;
    res_div.innerHTML='';
    for(let key in this_obj.img_json){
      let img=new Image();
      img.src=this_obj.img_json[key];
      res_div.appendChild(img);
      main.model.data.img[key]=img;
    }
  }
}
export default Resource;