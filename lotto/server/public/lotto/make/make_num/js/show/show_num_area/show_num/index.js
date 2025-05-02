import LottoDataFunc from "/lotto/common/js/func/data_func/index.js";

class ShowNumArr {
  static show(inData) {
    let opt_obj = {
      main: {},
      div_obj: null,
      num_arr:[],
      is_match_color:false,
      match_num_arr:[],
      match_color:"#ff0000",
      bonus_num:0,
      is_bonus_color:false,
      ...inData
    };
    let this_obj = this;
    let except_num_div = opt_obj.div_obj;
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
      if(opt_obj.is_match_color) {
        let match_num_arr = opt_obj.match_num_arr;
        if (match_num_arr.indexOf(tmp_num) > -1) {
          num_span.style.background = num_color;
          if(opt_obj.match_color) {
            num_span.style.background = opt_obj.match_color;
          }
        }
      }else{
        num_span.style.background = num_color;
      }
      
      except_num_div.appendChild(num_span);
    }
    if(opt_obj.bonus_num>0){
      let plus_span = document.createElement("span");
      plus_span.innerHTML = "+";
      except_num_div.appendChild(plus_span);

      let num_span = document.createElement("span");
      num_span.className = "lotto_number";
      num_span.innerHTML = opt_obj.bonus_num;

      let num_color = LottoDataFunc.get_color_by_num(opt_obj.bonus_num);
      if(opt_obj.is_match_color) {
        let match_num_arr = opt_obj.match_num_arr;
        if (match_num_arr.indexOf(opt_obj.bonus_num) > -1&&opt_obj.is_bonus_color) {
          num_span.style.background = num_color;
          if(opt_obj.match_color) {
            num_span.style.background = opt_obj.match_color;
          }
        }
      }else{
        num_span.style.background = num_color;
      }
      
      except_num_div.appendChild(num_span);
    }
  }
}
export default ShowNumArr;