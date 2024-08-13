import StringFunc from "./func/string/index.js";
import MyMath from "./func/math/index.js";
import ObjData from "./obj/obj.js";

class Main {
  objData = null;
  data = {
    lotto_list: [],
    lotto_total_data: {
      total: 0,
      match_per: 0,
      match_per_by_cnt: {},//{1:0,2:0,3:0,4:0,5:0,6:0}
      match_num_by_cnt: {},//{1:0,2:0,3:0,4:0,5:0,6:0}
      num_by_cnt: {},//{1:0,2:0,3:0,4:0,5:0,6:0}
      order: "number",//number,many,many_desc
      order_cnt_arr: [],
    },
    init_row_data: {
      idx: 0,
      num_arr: [0, 0, 0, 0, 0, 0],
      match_cnt: 0,
      match_per: 0,
    },
    num_length: 6,
    min_num: 1,
    max_num: 45,
    except_num_arr: [],
    match_num_arr: [],
  };
  auto_add_interval = null;
  auto_add_delay = 1000;
  init() {
    let this_obj = this;
    this.ObjData = new ObjData({
      main: this_obj
    });
    this.ObjData.init();
    this.init_event();
  }
  init_event() {
    let this_obj = this;
    this.ObjData.btn_objs.lotto_btn.addEventListener("click", () => {
      this_obj.make_lotto_num();
      this_obj.get_total_data();
      this_obj.show_lotto_num();
      this_obj.scroll_to_bottom();
    });
    this.ObjData.btn_objs.lotto_mullty_btn.addEventListener("click", () => {
      this_obj.make_lotto_num_multy({cnt:100});
      this_obj.get_total_data();
      this_obj.show_lotto_num();
      this_obj.scroll_to_bottom();
    });
    this.ObjData.btn_objs.auto_add_btn.addEventListener("click", () => {
      this_obj.start_auto_add();
    });
    this.ObjData.btn_objs.auto_add_stop_btn.addEventListener("click", () => {
      this_obj.stop_auto_add();
    });
    this.ObjData.btn_objs.remove_all_btn.addEventListener("click", () => {
      this_obj.data.lotto_list = [];
      this_obj.get_total_data();
      this_obj.show_lotto_num();
    });
    this.ObjData.btn_objs.pick_of_order_btn.addEventListener("click", () => {
      this_obj.set_math_num_by_order();
      this_obj.show_lotto_num();
    });
    let match_num_input_arr = [
      this_obj.ObjData.input_objs.match_num1,
      this_obj.ObjData.input_objs.match_num2,
      this_obj.ObjData.input_objs.match_num3,
      this_obj.ObjData.input_objs.match_num4,
      this_obj.ObjData.input_objs.match_num5,
      this_obj.ObjData.input_objs.match_num6,
    ];
    for (let input_i = 0; input_i < match_num_input_arr.length; input_i++) {
      let input_obj = match_num_input_arr[input_i];
      input_obj.addEventListener("change", () => {
        this_obj.get_math_num_by_input();
        this_obj.show_lotto_num();
      });
    }
    for (let input_i = 0; input_i < match_num_input_arr.length; input_i++) {
      let input_obj = match_num_input_arr[input_i];
      input_obj.addEventListener("click", (e) => {
        e.target.select();
      });
    }
    this.ObjData.search_objs.order_of_total.addEventListener("change", (e) => {
      let order = e.target.value;
      this_obj.data.lotto_total_data.order = order;
      this_obj.get_total_data();
      this_obj.show_lotto_num();
    });
  }
  show_lotto_num() {
    let this_obj = this;
    let lotto_list = this_obj.data.lotto_list;
    let layout_objs = this_obj.ObjData.layout_objs;
    layout_objs.lotto_list.innerHTML = "";
    for (let i = 0; i < lotto_list.length; i++) {
      let lotto_row = lotto_list[i];
      let num_arr = lotto_row.num_arr;
      let num_html_str = "";
      for (let j = 0; j < num_arr.length; j++) {
        let num_str = num_arr[j];
        let num_str_style = "display:inline-block;width:30px;height:20px;text-align:center;margin-left:10px;";
        if (this_obj.data.match_num_arr.indexOf(num_str) > -1) {
          num_str_style += "background-color:yellow;";
        };
        num_html_str += `<span style="${num_str_style}" >${num_str}</span>`;
      }
      num_html_str += `<span style="display:inline-block;width:30px;color:green;margin-left:10px;text-align:center;" >${lotto_row.match_cnt}</span>`;
      num_html_str += `<span style="display:inline-block;width:30px;text-align:center;" >${Math.round(lotto_row.match_per * 100)}%</span>`;
      let row_dom = document.createElement("div");
      row_dom.innerHTML = `<span style="display:inline-block;width:30px;text-align:center;" >${lotto_row.idx}</span> <span>${num_html_str}</span>`;
      layout_objs.lotto_list.appendChild(row_dom);
    }

    let total_span = this_obj.ObjData.text_objs.total_span;
    let total_html_str = "<span>" + lotto_list.length + "</span>";
    let match_num_html = "";
    for (let match_num in this_obj.data.lotto_total_data.match_num_by_cnt) {
      let match_cnt = this_obj.data.lotto_total_data.match_num_by_cnt[match_num];
      match_num_html += `
        <span style="display:inline-block;width:25px;color:gray;text-align:center;" >
          ${match_num}
        </span>
        <span style="display:inline-block;width:20px;background:orange;color:#fff;text-align:center;" >
          ${match_cnt}
        </span>`;
    }
    let match_num_wrap = "<div style='border-radius:5px;border:1px solid #ccc;padding:5px;' >Match:" + match_num_html + "</div>";
    total_span.innerHTML = total_html_str + match_num_wrap;

    let num_by_cnt_html = "";
    if (this_obj.data.lotto_total_data.order != "number") {
      let is_show_num_obj = {};
      for (let cnt_i = 0; cnt_i < this_obj.data.lotto_total_data.order_cnt_arr.length; cnt_i++) {
        let cnt = this_obj.data.lotto_total_data.order_cnt_arr[cnt_i];
        for (let num in this_obj.data.lotto_total_data.num_by_cnt) {
          let num_cnt = this_obj.data.lotto_total_data.num_by_cnt[num];
          if (cnt == num_cnt && is_show_num_obj[num] == undefined) {
            is_show_num_obj[num] = true;
            num_by_cnt_html += `
            <span style="display:inline-block;width:25px;color:gray;text-align:center;" >
              ${num}
            </span>
            <span style="display:inline-block;width:20px;background:orange;color:#fff;text-align:center;" >
              ${num_cnt}
            </span>`;
          }
        }
      }
    } else {
      for (let num in this_obj.data.lotto_total_data.num_by_cnt) {
        let num_cnt = this_obj.data.lotto_total_data.num_by_cnt[num];
        num_by_cnt_html += `
          <span style="display:inline-block;width:25px;color:gray;text-align:center;" >
            ${num}
          </span>
          <span style="display:inline-block;width:20px;background:orange;color:#fff;text-align:center;" >
            ${num_cnt}
          </span>`;
      }
    }
    let num_by_cnt_wrap = "<div style='border-radius:5px;border:1px solid #ccc;padding:5px;' >Num:" + num_by_cnt_html + "</div>";
    total_span.innerHTML += num_by_cnt_wrap;
  }
  scroll_to_bottom() {
    let this_obj = this;
    let layout_objs = this_obj.ObjData.layout_objs;
    layout_objs.lotto_list.scrollTop = layout_objs.lotto_list.scrollHeight;
  };
  start_auto_add() {
    let this_obj = this;
    this_obj.auto_add_interval = setInterval(() => {
      this_obj.make_lotto_num();
      this_obj.get_total_data();
      this_obj.show_lotto_num();
      this_obj.scroll_to_bottom();
    }, this_obj.auto_add_delay);
  };
  stop_auto_add() {
    let this_obj = this;
    if (this_obj.auto_add_interval) {
      clearInterval(this_obj.auto_add_interval);
    }
  };
  make_lotto_num() {
    let this_obj = this;
    let num_arr = [];
    let except_num_arr = [...this_obj.data.except_num_arr];
    let min_num = this_obj.data.min_num;
    let max_num = this_obj.data.max_num;
    let num_length = this_obj.data.num_length;
    let init_row_data = this_obj.data.init_row_data;
    for (let i = 0; i < num_length; i++) {
      let num = MyMath.random(min_num, max_num);
      while (except_num_arr.indexOf(num) > -1) {
        num = MyMath.random(min_num, max_num);
      }
      except_num_arr.push(num);
      num_arr.push(num);
    }
    num_arr.sort((a, b) => {
      return a - b;
    });

    this_obj.data.lotto_list.push({
      ...init_row_data,
      idx: this_obj.data.lotto_list.length + 1,
      num_arr: num_arr
    });
  }
  make_lotto_num_multy(inData){
    let opt_obj={
      cnt:1,
      ...inData
    };
    let this_obj = this;
    let cnt=opt_obj.cnt;
    for(let i=0;i<cnt;i++){
      this_obj.make_lotto_num();
    }
  };
  get_math_num_by_input() {
    let this_obj = this;
    let input_objs = this_obj.ObjData.input_objs;
    let match_num_arr = [];
    for (let key in input_objs) {
      let input_obj = input_objs[key];
      let num_str = input_obj.value;
      let num = StringFunc.number(num_str);
      match_num_arr.push(num);
      input_obj.value = num;
    }
    this_obj.data.match_num_arr = match_num_arr;

    this_obj.get_total_data();
  };
  get_total_data() {
    let this_obj = this;
    let lotto_list = this_obj.data.lotto_list;
    let match_num_arr = this_obj.data.match_num_arr;
    this_obj.data.lotto_total_data.total = this_obj.data.lotto_list.length;
    this_obj.data.lotto_total_data.match_num_by_cnt = {};
    this_obj.data.lotto_total_data.num_by_cnt = {};
    for (let i = 0; i < lotto_list.length; i++) {
      let lotto_row = lotto_list[i];
      let num_arr = lotto_row.num_arr;
      let match_cnt = 0;
      for (let j = 0; j < num_arr.length; j++) {
        let num = num_arr[j];
        let num_str = num.toString();
        if (this_obj.data.lotto_total_data.num_by_cnt[num_str] == undefined) {
          this_obj.data.lotto_total_data.num_by_cnt[num_str] = 0;
        }
        this_obj.data.lotto_total_data.num_by_cnt[num_str]++;

        if (match_num_arr.indexOf(num) > -1) {
          match_cnt++;
          if (this_obj.data.lotto_total_data.match_num_by_cnt[num_str] == undefined) {
            this_obj.data.lotto_total_data.match_num_by_cnt[num_str] = 0;
          }
          this_obj.data.lotto_total_data.match_num_by_cnt[num_str]++;
        }
      }
      lotto_row.match_cnt = match_cnt;
      lotto_row.match_per = match_cnt / this_obj.data.num_length;
      this_obj.set_order_total();
    }
  };
  set_order_total() {
    let this_obj = this;
    let order = this_obj.data.lotto_total_data.order;

    let cnt_arr = [];
    for (let key in this_obj.data.lotto_total_data.num_by_cnt) {
      cnt_arr.push(this_obj.data.lotto_total_data.num_by_cnt[key]);
    }
    if (order == "many") {
      cnt_arr.sort((a, b) => {
        return b - a;
      });
    } else {
      cnt_arr.sort((a, b) => {
        return a - b;
      });
    }
    this_obj.data.lotto_total_data.order_cnt_arr = cnt_arr;
  };
  set_math_num_by_order() {
    let this_obj = this;
    let new_match_num_arr = [];
    let is_show_num_obj = {};
    for (let cnt_i = 0; cnt_i < this_obj.data.lotto_total_data.order_cnt_arr.length; cnt_i++) {
      let cnt = this_obj.data.lotto_total_data.order_cnt_arr[cnt_i];
      for (let num in this_obj.data.lotto_total_data.num_by_cnt) {
        let num_cnt = this_obj.data.lotto_total_data.num_by_cnt[num];
        if (cnt == num_cnt && is_show_num_obj[num] == undefined) {
          is_show_num_obj[num] = true;
          if(new_match_num_arr.length<6){
            new_match_num_arr.push(num);
          }
        }
      }
    }
    new_match_num_arr.sort((a, b) => {
      return a - b;
    });
    
    let input_objs = this_obj.ObjData.input_objs;
    let input_order_num=0;
    for (let key in input_objs) {
      let input_obj = input_objs[key];
      if(new_match_num_arr[input_order_num]!=undefined){
        input_obj.value=new_match_num_arr[input_order_num];
      }
      input_order_num++;
    }
    this_obj.get_math_num_by_input();
  };
}
export default Main;