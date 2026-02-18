class BasicButton {
  data = {
    name: '',
    text: '',
    x: 0,
    y: 0,
    width: 120,
    height: 50,
    color: 'white',
    backgroundColor: 'black',
    borderColor: 'black',
    borderWidth: 0,
    borderRadius: 0,

    on_click: null,
    on_hover: null,
  }
  constructor(data) {
    let this_obj = this;
    this.data = {
      ...this_obj.data,
      ...data,
    };
  }
  on_hover(inData) {
    let opt_obj={
      ctx:null,
      ...inData,
    };
    let this_obj = this;
    let ctx = opt_obj.ctx;
    let data = this_obj.data;
    if (data.on_hover) {
      data.on_hover();
    }

    ctx.save();
    ctx.fillStyle = 'rgba(76, 76, 76, 0.2)';
    ctx.fillRect(data.x, data.y, data.width, data.height);
    ctx.restore();
  }
  render(ctx) {
    let this_obj = this;
    let data = this_obj.data;
    ctx.save();
    ctx.fillStyle = data.backgroundColor;
    
    ctx.fillRect(data.x, data.y, data.width, data.height);
    if (data.borderWidth > 0) {
      ctx.lineWidth = data.borderWidth;
      ctx.strokeStyle = data.borderColor;
      ctx.strokeRect(data.x, data.y, data.width, data.height);
    }
    ctx.fillStyle = data.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '16px Arial';
    ctx.fillText(data.text, data.x + data.width / 2, data.y + data.height / 2);
    ctx.restore();
  }
}
export default BasicButton;