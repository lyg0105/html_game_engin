import LottoDataFunc from "/lotto/common/js/func/data_func/index.js";

class ShowNumArr {
  static show(inData) {
    let opt_obj = {
      main: {},
      div_id: "except_num_div",
      num_arr:[],
      ...inData
    };
    let this_obj = this;
    let except_num_div = document.getElementById(opt_obj.div_id);
    except_num_div.innerHTML = "";
    let num_arr = opt_obj.num_arr;
    if (num_arr.length == 0) {
      let empty_div = document.createElement("div");
      empty_div.innerHTML = "선택없음";
      empty_div.style.color = "#545454";
      except_num_div.appendChild(empty_div);
      return false;
    }

    for (let i = 0; i < num_arr.length; i++) {
      let tmp_num = num_arr[i];
      let num_span = document.createElement("span");
      num_span.className = "lotto_number";
      num_span.innerHTML = tmp_num;

      let num_color = LottoDataFunc.get_color_by_num(tmp_num);
      num_span.style.background = num_color;
      except_num_div.appendChild(num_span);
    }
  }
}
export default ShowNumArr;