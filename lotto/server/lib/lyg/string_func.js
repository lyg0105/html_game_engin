//var StrFunc=require(global.LottoConstant.ABS+'lib/lyg/string_func');
//if(StrFunc.str_in_array(search_str,str_arr)!=-1){}
//if(!StrFunc.is_empty(data)){}
//str=StrFunc.checkInputStr(str);
//var str=StrFunc.str_pad({"str":str,"pad_length":2});
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
  static getNumber(str) {
    str = str + "";
    str = str.replace(/[^0-9-.]/g, "");
    if (str == "") { str = "0"; }
    return str.replace(/[^0-9-.]/g, "");
  }

  static getNumber2(str) {
    str = str + "";
    str = str.replace(/[^0-9]/g, "");
    return str;
  }

  //var str=StringFunc.str_replace(search,replace,content);
  static str_replace(search, replace, content) {
    if (typeof content != "string") {
      content = "";
    }
    while (content.indexOf(search) != -1) {
      content = content.replace(search, replace);
    }
    return content;
  }
  static trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
  }
  static is_empty(str) {
    if (str === false || str === undefined || str === null) {
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
      if (Object.keys(str).length === 0) {
        return true;
      } else if (str.length != undefined && str.length == 0) {
        return true;
      }
    }
    return false;
  }
  static cut_str(str, cut_len, tail_str) {
    str = str + "";
    if (cut_len == undefined) { cut_len = 8; }
    if (tail_str == undefined) { tail_str = ".."; }
    let str_len = str.length;
    str = str.substring(0, cut_len);
    if (str_len > cut_len) {
      str += tail_str;
    }
    return str;
  };
  static checkInputStr(str) {
    if (typeof str != "string") {
      return str;
    }
    str = str.replace(/\\/gi, "");
    str = str.replace(/\'/gi, "");
    str = str.replace(/'/gi, "");
    str = str.replace(/<meta/gi, "");
    str = str.replace(/<%/gi, "");
    str = str.replace(/%>/gi, "");
    str = str.replace(/<script/gi, "");
    str = str.replace(/<\/script/gi, "");
    str = str.replace(/&amp;/gi, "&");
    str = this.str_replace("/>", "", str);
    return str;
  }
  static escapeHtml(str) {
    if (typeof str != "string") {
      return str;
    }
    return str
      // .replace(/&/g, '&amp;')
      // .replace(/</g, '&lt;')
      // .replace(/>/g, '&gt;')
      // .replace(/"/g, '&quot;')
      .replace(/'/g, "&#039;")
      .replace(/'/g, "&#39;");
  }
  static unescapeHtml(str) {
    if (typeof str != "string") {
      return str;
    }
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'");
  }
  //콤마찍기
  static comma = function (str) {
    str = str + "";
    str = str.replace(/[^0-9.-]/gi, "");
    str = this.str_replace(",", "", str);
    if (str == "") { str = "0"; }
    var is_minus = false;
    var is_decimal = false;
    var un_decimal_str = "";
    //set Minus
    var tmp_str_arr = str.split("-");
    if (tmp_str_arr.length == 2) {
      if (tmp_str_arr[0] == "") {
        str = tmp_str_arr[1];
        is_minus = true;
      }
    }
    //set Decimal
    tmp_str_arr = str.split(".");
    if (tmp_str_arr.length == 2) {
      //if(tmp_str_arr[1]!=""){
      is_decimal = true;
      str = tmp_str_arr[0];
      un_decimal_str = tmp_str_arr[1];
      var tmp_len = un_decimal_str.length;
      if (tmp_len >= 3) { tmp_len = 3; }
      un_decimal_str = un_decimal_str.substr(0, tmp_len);
      //}
    } else if (tmp_str_arr.length > 2) {
      str = "0";
    }
    //check number
    str = Number(str);
    if (str == Number.NaN) {
      str = "0";
    }

    //set comma
    str = String(str);
    str = str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');

    if (is_minus) {
      str = "-" + str;
    }

    if (is_decimal) {
      str = str + "." + un_decimal_str;
    }
    return str;
  };
  //콤마풀기
  static uncomma = function (str) {
    str = String(str);
    str = str.replace(/[^0-9.-]/gi, "");
    if (str == "") { str = "0"; }

    var tmp_str_arr = str.split("-");
    if (tmp_str_arr.length == 2) {
      if (tmp_str_arr[0] != "") {
        str = tmp_str_arr[1];
      } else {
        str = "-" + tmp_str_arr[1];
      }
    }

    tmp_str_arr = str.split(".");
    if (tmp_str_arr.length == 2) {
      if (tmp_str_arr[1] == "") {
        str = tmp_str_arr[0];
      }
    }

    return str.replace(/[^0-9.-]/gi, "");
  };
  //자동채움
  //var str=StrFunc.str_pad({"str":str,"pad_length":2});
  static str_pad = function (in_opt_obj) {
    var opt_obj = {
      "str": "",
      "pad_str": "0",
      "pad_length": 0,
      "direction": "left"
    };
    for (var key in in_opt_obj) {
      opt_obj[key] = in_opt_obj[key];
    }
    var str = String(opt_obj["str"]);
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
  static autoHypenPhone = function (str) {//02번호, 업체번호, 자동 하이픈 넣기
    str = String(str);
    str = str + "";
    str = str.replace(/[^0-9]/g, '');
    var tmp = '';
    var num02 = 0;
    var num02_1 = 0;
    if (str.substr(0, 2) == "02") {
      num02 = 1;
    } else {
      num02 = 0;
    }
    if (str.length < 4 - num02) {
      return str;
    } else if (str.length < 7) {
      tmp += str.substr(0, 3 - num02);
      tmp += '-';
      tmp += str.substr(3 - num02);
    } else if (str.length < 11) {
      if (str.substr(0, 2) == "02" && str.length >= 10) {
        num02_1 = 1;
        str = str.substr(0, 11 - num02);
      } else {
        num02_1 = 0;
      }
      tmp += str.substr(0, 3 - num02);
      tmp += '-';
      tmp += str.substr(3 - num02, 3 + num02_1);
      tmp += '-';
      tmp += str.substr(6 - num02 + num02_1);

      if (str.length == 8) {
        tmp = '';
        tmp += str.substr(0, 4);
        tmp += '-';
        tmp += str.substr(4);
      }
    } else {
      if (str.substr(0, 2) == "02" && str.length >= 10) {
        num02_1 = 1;
        str = str.substr(0, 11 - num02);
      } else {
        num02_1 = 0;
      }
      str = str.substr(0, 11 - num02);
      tmp += str.substr(0, 3 - num02);
      tmp += '-';
      tmp += str.substr(3 - num02, 4);
      tmp += '-';
      tmp += str.substr(7 - num02);
    }
    return tmp;
  }
  static autoHypenbusin_num(str) {//사업자 번호 '-'없이 숫자만 입력하라고 요청.
    str = String(str);
    str = str.replace(/[^0-9]/g, '');
    var tmp = '';
    if (str.length < 4) {
      return str;
    } else if (str.length < 7) {
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3);
    } else if (str.length < 11) {
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3, 2);
      tmp += '-';
      tmp += str.substr(5);
    } else {
      str = str.substr(0, 10);
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3, 2);
      tmp += '-';
      tmp += str.substr(5);
    }
    if (str.length == 10) {
      var busin_check = "137137135";
      var busin_last_num = 0;
      var check_sum = 0;
      var no = tmp.replace(/-/g, '');
      for (var i = 0; i < 9; i++) {
        var multiply_check = Number(busin_check.charAt(i)) * Number(no.charAt(i));
        if (i < 8) {
          check_sum += multiply_check;
        } else {
          check_sum += Number(String(multiply_check).charAt(0)) + Number(String(multiply_check).charAt(1));
          busin_last_num = (10 - (check_sum % 10)) % 10; // (10 - (체크섬 % 10)) % 10
        }
      }
      if (busin_last_num != no.charAt(9)) {
        //alert("사업자 번호가 유효하지 않습니다.");
      }
    }
    return tmp;
  };
  //날짜 사이 하이픈 넣기
  static autoHypenDateStr(str) {
    str = String(str);
    str = str.replace(/[^0-9]/g, "");
    var left_num = str.substring(0, 4);
    var mid_num = str.substring(4, 6);
    var right_num = str.substring(6, 8);
    var str = left_num;
    if (mid_num != "") {
      var tmp_len = mid_num.length;
      mid_num = parseInt(mid_num);
      if (mid_num < 0 && mid_num != "0") {
        mid_num = 1;
      } else if (mid_num > 12) {
        mid_num = 12;
      }
      if (mid_num < 10 && tmp_len == 2) {
        mid_num = "0" + mid_num;
      }
      str += "-" + mid_num;
    }
    if (right_num != "") {
      var tmp_len = right_num.length;
      right_num = parseInt(right_num);
      if (right_num < 0 && right_num != "0") {
        right_num = "01";
      } else if (right_num > 31) {
        right_num = "31";
      }
      if (right_num < 10 && tmp_len == 2) {
        right_num = "0" + right_num;
      }
      str += "-" + right_num;
    }
    return str;
  };
  static autoHypenLawNum(str) {
    if (typeof str != "string") {
      str = "";
    }
    str = str.replace(/[^0-9]/g, "");
    var left_num = str.substr(0, 6);
    var right_num = str.substr(6, 7);
    var str = left_num;
    if (right_num != "") {
      str += "-" + right_num;
    }
    return str;
  };
  static autoHypenResidentNum(str) {
    if (typeof str != "string") {
      str = "";
    }
    str = str.replace(/[^0-9]/g, "");
    var left_num = str.substr(0, 6);
    var right_num = str.substr(6, 7);
    var str = left_num;
    if (right_num != "") {
      str += "-" + right_num;
    }
    return str;
  };
  static is_json_string(str) {
    try {
      var json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }
}
module.exports = StringFunc;