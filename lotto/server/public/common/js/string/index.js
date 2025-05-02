class StringFunc {
  static str_in_array(search_str, str_arr) {
    var is_match = -1;
    for (var i = 0; i < str_arr.length; i++) {
      if (str_arr[i] == search_str) {
        is_match = true;
      }
    }
    return is_match;
  }
  static remove_str_in_array(search_str, str_arr) {
    for (var i = 0; i < str_arr.length; i++) {
      if (str_arr[i] == search_str) {
        str_arr.splice(i, 1);
        break;
      }
    }
    return str_arr;
  }
  static remove_idx_in_array(idx, str_arr) {
    let new_arr = [];
    for (var i = 0; i < str_arr.length; i++) {
      if (i != idx) {
        new_arr.push(str_arr[i]);
      }
    }
    return new_arr;
  }
  static str_replace(search, replace, content) {
    while (content.indexOf(search) != -1) {
      content = content.replace(search, replace);
    }
    return content;
  }
  static number(num_str) {
    if (num_str == undefined || num_str == null || num_str == "") {
      return 0;
    }
    num_str = num_str + "";
    let is_minus = false;
    if (num_str.split("-").length == 2) {
      is_minus = true;
    }
    num_str = num_str.replace(/[^0-9]/g, "");
    let num = Number(num_str);
    if (is_minus) {
      num = num * -1;
    }
    return num;
  };
  static comma(num_str) {
    num_str = num_str + "";
    let is_minus = false;
    if (num_str.split("-").length == 2) {
      is_minus = true;
    }
    num_str = num_str.replace(/[^0-9]/g, "");
    let num = Number(num_str);
    if (is_minus) {
      num = num * -1;
    }
    let str_num = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str_num;
  }
  static uncomma(num_str) {
    num_str = num_str + "";
    let is_minus = false;
    if (num_str.split("-").length == 2) {
      is_minus = true;
    }
    num_str = num_str.replace(/[^0-9]/g, "");
    let num = Number(num_str);
    if (is_minus) {
      num = num * -1;
    }
    return num;
  }
  static str_pad(in_opt_obj) {
    var opt_obj = {
      "str": "",
      "pad_str": "0",
      "pad_length": 0,
      "direction": "left"
    };
    for (var key in in_opt_obj) {
      opt_obj[key] = in_opt_obj[key];
    }
    var str = opt_obj["str"] + "";
    var pad_str = opt_obj["pad_str"];
    var pad_length = parseInt(opt_obj["pad_length"]);
    var direction = opt_obj["direction"];

    var str_length = str.length;
    if (str_length < pad_length) {
      var pad_cnt = pad_length - str_length;
      for (var i = 0; i < pad_cnt; i++) {
        if (direction == "left") {
          str = pad_str + str;
        } else if (direction == "right") {
          str = str + pad_str;
        }
      }
    }
    return str;
  };
  static get_local_storage(key, default_value) {
    let storage_value = localStorage.getItem(key);
    if (storage_value == null) {
      return default_value;
    } else {
      return storage_value;
    }
  }
  static set_local_storage(key, value) {
    localStorage.setItem(key, value);
  }
}
export default StringFunc;