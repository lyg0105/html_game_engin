class ButtonBase{
  data = {
    idx:0,
    id: 'button',
    x: 0,
    y: 0,
    width: 100,
    height: 30,
    text: 'button',
    color: '#000',
    background: '#f0cf4b',
    hover: '#ccc',
    active_background: '#ff0000',
    active_color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    is_display: true,
  };
  is_hover=false;
  is_active=false;
  constructor(inData) {
    let opt_obj = {
      data: {},
      on_click_custom: () => {},
      ...inData
    };
    let this_obj = this;
    this.data = {
      ...this_obj.data,
      ...opt_obj.data
    };
    this.on_click_custom = opt_obj.on_click_custom;
  }
  draw(ctx) {
    if (this.data.is_display) {
      ctx.fillStyle = this.data.background;
      if(this.is_active){
        ctx.fillStyle = this.data.active_background;
      }
      if (this.is_hover) {
        ctx.fillStyle = this.data.hover;
      }
      ctx.fillRect(this.data.x, this.data.y, this.data.width, this.data.height);
      ctx.strokeStyle = this.data.color;
      ctx.strokeRect(this.data.x, this.data.y, this.data.width, this.data.height);
      ctx.fillStyle = this.data.color;
      if(this.is_active){
        ctx.fillStyle = this.data.active_color;
      }
      ctx.font = this.data.fontSize + 'px Arial';
      ctx.textAlign = this.data.textAlign;
      ctx.fillText(this.data.text, this.data.x+(this.data.width/2), this.data.y + (this.data.height/2) + (this.data.fontSize/4));
    }
  }
  on_click() {
    let this_obj = this;
    this.on_click_custom();
    this.is_hover=true;
    setTimeout(() => {
      this_obj.is_hover=false;
    }, 100);
  }
  on_click_custom() {}
}
export default ButtonBase;