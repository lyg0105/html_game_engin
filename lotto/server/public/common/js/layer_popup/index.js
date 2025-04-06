//import LayerPopup from "/common/js/layer_popup/index.js";
class LayerPopup
{
  data={
    title:"팝업",
    content:"",
    width:"100%",
    height:"100vh",
    is_show:false,
    is_show_close_btn:true,
    is_show_title:true,
    top:0,
    left:0,
    layer_style:{},
    title_style:{},
    content_style:{},
    close_btn_style:{},
    popup_class_name:"layer_popup",
    title_class_name:"popup_title",
    content_class_name:"popup_con",
    close_btn_class_name:"close_btn",
    onClose:function(){},
    onShow:function(){},
    popup_element:null,
    title_element:null,
    title_span_element:null,
    content_element:null,
    close_btn_element:null,
  };
  constructor(data) {
    this.init(data);
  }
  init(data) {
    this.data = { ...this.data, ...data };
    this.data.popup_element = document.createElement("div");
    this.data.popup_element.className = this.data.popup_class_name;
    this.data.popup_element.style.width = this.data.width;
    this.data.popup_element.style.height = this.data.height;
    this.data.popup_element.style.position = "fixed";
    this.data.popup_element.style.top = this.data.top+"px";
    this.data.popup_element.style.left = this.data.left+"px";
    this.data.popup_element.style.zIndex = 1000;
    this.data.layer_style && Object.assign(this.data.popup_element.style, this.data.layer_style);

    if (this.data.is_show_title) {
      this.createTitle();
    }
    if (this.data.is_show_close_btn) {
      this.createCloseBtn();
    }
    if (this.data.content) {
      this.createContent();
    }
  }
  createTitle() {
    this.data.title_element = document.createElement("div");
    this.data.title_element.className = this.data.title_class_name;

    this.data.title_span_element = document.createElement("span");
    this.data.title_span_element.innerHTML = this.data.title;
    this.data.title_element.appendChild(this.data.title_span_element);

    this.data.title_style && Object.assign(this.data.title_element.style, this.data.title_style);
    this.data.popup_element.appendChild(this.data.title_element);
  }
  createContent() {
    this.data.content_element = document.createElement("div");
    this.data.content_element.className = this.data.content_class_name;
    this.data.content_element.innerHTML = this.data.content;
    this.data.content_style && Object.assign(this.data.content_element.style, this.data.content_style);
    this.data.popup_element.appendChild(this.data.content_element);
  }
  createCloseBtn() {
    this.data.close_btn_element = document.createElement("button");
    this.data.close_btn_element.className = this.data.close_btn_class_name;
    this.data.close_btn_element.innerHTML = "X";
    this.data.close_btn_style && Object.assign(this.data.close_btn_element.style, this.data.close_btn_style);
    this.data.title_element.appendChild(this.data.close_btn_element);
    this.data.close_btn_element.addEventListener("click", () => {
      this.hide();
      this.data.onClose();
    });
  }
  show() {
    this.data.is_show = true;
    document.body.appendChild(this.data.popup_element);
    this.data.onShow();
  }
  hide() {
    this.data.is_show = false;
    if (this.data.popup_element) {
      document.body.removeChild(this.data.popup_element);
    }
  }
  setTitle(title) {
    this.data.title = title;
    if (this.data.title_span_element) {
      this.data.title_span_element.innerHTML = title;
    }
  }
  setContent(content) {
    this.data.content = content;
    if (this.data.content_element) {
      this.data.content_element.innerHTML = content;
    }
  }
  setWidth(width) {
    this.data.width = width;
    if (this.data.popup_element) {
      this.data.popup_element.style.width = width + "px";
    }
  }
  setHeight(height) {
    this.data.height = height;
    if (this.data.popup_element) {
      this.data.popup_element.style.height = height + "px";
    }
  }
  setPosition(top, left) {
    this.data.top = top;
    this.data.left = left;
    if (this.data.popup_element) {
      this.data.popup_element.style.top = top;
      this.data.popup_element.style.left = left;
    }
  }
  setLayerStyle(style) {
    this.data.layer_style = style;
    if (this.data.popup_element) {
      Object.assign(this.data.popup_element.style, style);
    }
  }
  setTitleStyle(style) {
    this.data.title_style = style;
    if (this.data.title_element) {
      Object.assign(this.data.title_element.style, style);
    }
  }
  setContentStyle(style) {
    this.data.content_style = style;
    if (this.data.content_element) {
      Object.assign(this.data.content_element.style, style);
    }
  }
  setCloseBtnStyle(style) {
    this.data.close_btn_style = style;
    if (this.data.close_btn_element) {
      Object.assign(this.data.close_btn_element.style, style);
    }
  }
  setPopupClassName(class_name) {
    this.data.popup_class_name = class_name;
    if (this.data.popup_element) {
      this.data.popup_element.className = class_name;
    }
  }
  setTitleClassName(class_name) {
    this.data.title_class_name = class_name;
    if (this.data.title_element) {
      this.data.title_element.className = class_name;
    }
  }
  setContentClassName(class_name) {
    this.data.content_class_name = class_name;
    if (this.data.content_element) {
      this.data.content_element.className = class_name;
    }
  }
  setCloseBtnClassName(class_name) {
    this.data.close_btn_class_name = class_name;
    if (this.data.close_btn_element) {
      this.data.close_btn_element.className = class_name;
    }
  }
  setOnClose(callback) {
    this.data.onClose = callback;
  }
  setOnShow(callback) {
    this.data.onShow = callback;
  }
  setOnHide(callback) {
    this.data.onHide = callback;
  }
  setOnClick(callback) {
    this.data.onClick = callback;
  }
}
export default LayerPopup;