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
  static is_empty(str) {
    if (!str) {
      return true;
    } else if (str == undefined) {
      return true;
    } else if (typeof str == "string") {
      if (str == "" || str == "null" || str == "NULL") {
        return true;
      } else if (str == "0") {
        return true;
      }
    } else if (typeof str == "number") {
      if (str == 0) {
        return true;
      }
    } else if (typeof str == "object") {
      if (str.length == 0) {
        return true;
      }
    }
    return false;
  };
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
  static uncomma_int(str) {
    str = this.uncomma(str);
    str = parseInt(str);
    return str;
  };
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
  static secondsToTimeJson(seconds) {
    if (seconds == "") { seconds = "0"; }
    var sec_num = parseInt(seconds + ""); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }

    return {
      "h": hours,
      "i": minutes,
      "s": seconds,
    };
  };
  static timeJsonToString(timeJson) {
    let time_str_arr = [];
    if (timeJson.h != "00") {
      time_str_arr.push(timeJson.h);
    }
    time_str_arr.push(timeJson.i);
    time_str_arr.push(timeJson.s);
    return time_str_arr.join(":");
  }
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