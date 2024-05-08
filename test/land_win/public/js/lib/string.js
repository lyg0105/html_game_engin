//strFunc.comma();
var LygString = function () {
    this.init = function () {

    };

    this.str_replace = function (search, replace, content) {
        while (content.indexOf(search) != -1) {
            content = content.replace(search, replace);
        }
        return content;
    };

    this.getNumber = function (str) {
        str = str + "";
        return str.replace(/[^0-9-.]/g, "");
    };

    this.getNumber2 = function (str) {
        str = str + "";
        return str.replace(/[^0-9]/g, "");
    };

    this.str_in_array = function (search_str, str_arr) {
        var is_match = -1;
        for (var i = 0; i < str_arr.length; i++) {
            if (str_arr[i] == search_str) {
                is_match = true;
            }
        }
        return is_match;
    };
    this.remove_empty_of_arr = function (arr) {
        let this_obj = this;
        let arr_len = arr.length;
        let new_arr = [];
        for (let i = 0; i < arr_len; i++) {
            if (!this_obj.is_empty(arr[i])) {
                new_arr.push(arr[i]);
            }
        }
        return new_arr;
    };
    this.strip_tag = function (str) {
        return str.replace(/(<([^>]+)>)/ig, "");
    };
    this.strip_img_tag = function (str) {
        var img_tag = /<IMG(.*?)>/gi;
        return str.replace(img_tag, "");
    };
    this.cut_str = function (str, cut_len, tail_str) {
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

    this.autoHypenPhone = function (str) {//02번호, 업체번호, 자동 하이픈 넣기
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
    };

    this.autoHypenbusin_num = function (str) {//사업자 번호 '-'없이 숫자만 입력하라고 요청.
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
    this.checkBusinNum = function (value) {
        var valueMap = value.replace(/-/gi, '').split('').map(function (item) {
            return parseInt(item, 10);
        });
        if (valueMap.length === 10) {
            var multiply = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5);
            var checkSum = 0;
            for (var i = 0; i < multiply.length; ++i) {
                checkSum += multiply[i] * valueMap[i];
            }
            checkSum += parseInt((multiply[8] * valueMap[8]) / 10, 10);
            return Math.floor(valueMap[9]) === ((10 - (checkSum % 10)) % 10);
        }
        return false;
    }
    this.autoHypenLawNum = function (str) {
        str = str.replace(/[^0-9]/g, "");
        var left_num = str.substr(0, 6);
        var right_num = str.substr(6, 7);
        var str = left_num;
        if (right_num != "") {
            str += "-" + right_num;
        }
        return str;
    };
    this.autoHypenResidentNum = function (str) {
        str = str.replace(/[^0-9]/g, "");
        var left_num = str.substr(0, 6);
        var right_num = str.substr(6, 7);
        var str = left_num;
        if (right_num != "") {
            str += "-" + right_num;
        }
        return str;
    };
    this.autoHypenDateStr = function (str) {
        str = str + "";
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
    this.isAlpha = function (str) {
        var pattern = /[a-zA-Z]+/;
        return (pattern.test(str)) ? true : false;
    };
    //콤마찍기
    this.comma = function (str) {
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
    this.uncomma = function (str) {
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
    //var str=strFunc.str_pad({"str":str,"pad_length":2});
    this.str_pad = function (in_opt_obj) {
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
    //var date_json=strFunc.get_date_json(new Date());
    this.get_date_json = function (d_obj) {
        if (d_obj == undefined) {
            return this.date_obj;
        }
        var rs_json = {
            'Y': d_obj.getFullYear(),
            'm': d_obj.getMonth() + 1,
            'd': d_obj.getDate(),
            'h': d_obj.getHours(),
            'i': d_obj.getMinutes(),
            's': d_obj.getSeconds(),
            'day': d_obj.getDay(),
            'date_obj': d_obj
        };
        rs_json['last_day'] = (new Date(rs_json.Y, rs_json.m, 0)).getDate();
        rs_json['t'] = rs_json['last_day'];
        rs_json['first_day_of_week'] = (new Date(rs_json.Y, rs_json.m - 1, 1)).getDay();

        return rs_json;
    };
    //var date_obj=strFunc.get_change_date(new Date('2019-10-25'),'year',+1,'Y-m-d');
    this.get_change_date = function (d_obj, type, num, format_str) {
        var d_json = this.get_date_json(d_obj);

        if (type == 'year') {
            d_obj.setFullYear(d_json.Y + num);
        } else if (type == 'month') {
            d_obj.setMonth(d_json.m + num - 1);
        } else if (type == 'day') {
            d_obj.setDate(d_json.d + num);
        }

        if (format_str != undefined) {
            d_obj = this.get_date_format(d_obj, format_str);
        }

        return d_obj;
    };
    //var format_str=strFunc.get_date_format(new Date(),"Y-m-d h:i:s");
    this.get_date_format = function (d_obj, format_str) {
        if (typeof d_obj != "object") {
            return "";
        }
        var d_json = this.get_date_json(d_obj);
        var f_arr = [];
        for (var key in d_json) {
            if (key != 'day') {
                f_arr.push(key);
            }
        }
        var rs_str = '';
        for (var i = 0; i < format_str.length; i++) {
            var tmp_c = format_str.charAt(i);
            if (this.str_in_array(tmp_c, f_arr) != -1) {
                tmp_c = this.str_pad({ "str": d_json[tmp_c], "pad_length": 2 });
            }
            rs_str += tmp_c;
        }

        return rs_str;
    };
    /**
     * Return an object with the selection range or cursor position (if both have the same value)
     * @param {DOMElement} el A dom element of a textarea or input text.
     * @return {Object} reference Object with 2 properties (start and end) with the identifier of the location of the cursor and selected text.
     **/
    this.getInputSelection = function (el) {
        var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;

        if (el.nodeName == "SELECT") {
            return {
                start: start,
                end: end
            };
        }

        if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
            start = el.selectionStart;
            end = el.selectionEnd;
        } else {
            range = document.selection.createRange();

            if (range && range.parentElement() == el) {
                len = el.value.length;
                normalizedValue = el.value.replace(/\r\n/g, "\n");

                // Create a working TextRange that lives only in the input
                textInputRange = el.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());

                // Check if the start and end of the selection are at the very end
                // of the input, since moveStart/moveEnd doesn't return what we want
                // in those cases
                endRange = el.createTextRange();
                endRange.collapse(false);

                if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                    start = end = len;
                } else {
                    start = -textInputRange.moveStart("character", -len);
                    start += normalizedValue.slice(0, start).split("\n").length - 1;

                    if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                        end = len;
                    } else {
                        end = -textInputRange.moveEnd("character", -len);
                        end += normalizedValue.slice(0, end).split("\n").length - 1;
                    }
                }
            }
        }

        return {
            start: start,
            end: end
        };
    };
    //scrollMoveToTarget({'base_obj':'#div','focus_obj':'#input'});
    this.scrollMoveToTarget = function (opt_obj) {
        if (opt_obj == undefined) { opt_obj = {}; }
        base_obj = opt_obj['base_obj'];
        focus_obj = opt_obj['focus_obj'];
        if (!base_obj || !focus_obj) {
            //console.log("기본 세팅값이 없습니다.",base_obj,focus_obj);
            return false;
        }
        var offset = $(focus_obj).position();//position
        var top_num = $(base_obj).scrollTop() + offset.top;
        var left_num = $(base_obj).scrollLeft() + offset.left;
        var scroll_w = $(base_obj)[0].scrollWidth;
        var target_w = $(focus_obj).innerWidth();
        var div_w = $(base_obj).innerWidth();
        var scroll_h = $(base_obj)[0].scrollHeight;
        var target_h = $(focus_obj).innerHeight();
        var div_h = $(base_obj).innerHeight();

        if ((div_w - target_w) > left_num) {
            $(base_obj).scrollLeft(0);
        } else {
            $(base_obj).scrollLeft(left_num);//+target_w
        }
        if ((div_h - (target_h * 2)) > top_num) {
            $(base_obj).scrollTop(0);
        } else {
            $(base_obj).scrollTop(top_num - div_h + (target_h * 2));
        }
    };
    this.nl2br = function (str) {
        str = String(str);
        return str.replace(/\n/g, "<br />");
    };
    this.trim = function (str) {
        str = String(str);
        return str.replace(/^\s+|\s+$/g, "");
    };
    this.base64Encode = function (str) {
        return btoa(str);
    };
    this.base64Decode = function (str) {
        return atob(str);
    };
    this.is_empty = function (str) {
        if (!str) {
            return true;
        } else if (str == undefined) {
            return true;
        } else if (typeof str == "string") {
            if (str == ""||str == "null"||str == "NULL") {
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
    //00:00=>[00,00]
    this.timeToHourMinute = (time_str) => {
        let hm_data = { "h": "00", "m": "00" };
        time_str = time_str + "";
        let time_arr = time_str.split(":");
        if (time_arr.length != 2) {
            return hm_data;
        }
        hm_data = {
            "h": time_arr[0],
            "m": time_arr[1]
        };
        return hm_data;
    };
    //[00,00]=>00:00
    this.HourMinuteToTime = (h, m) => {
        h = h + "";
        m = m + "";
        h = this.str_pad({ "str": h, "pad_length": 2 });
        m = this.str_pad({ "str": m, "pad_length": 2 });
        return h + ":" + m;
    };
    this.hisToSeconds = (his_str) => {
        let his_split_arr = his_str.split(":");
        let his_sec = 0;
        if (his_split_arr.length == 3) {
            his_sec = this.timeToSeconds(his_split_arr[0], his_split_arr[1], his_split_arr[2]);
        } else if (his_split_arr.length == 2) {
            his_sec = this.timeToSeconds(his_split_arr[0], his_split_arr[1], "00");
        } else if (his_split_arr.length == 1) {
            his_sec = this.timeToSeconds(his_split_arr[0], "00", "00");
        }
        return his_sec;
    };
    this.timeToSeconds = (hours, minutes, seconds) => {
        hours = parseInt(hours + "");
        minutes = parseInt(minutes + "");
        seconds = parseInt(seconds + "");
        return hours * 3600 + minutes * 60 + seconds;
    };
    this.secondsToTimeJson = (seconds) => {
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
    this.timeJsonToTimeStr=(his_json,opt_sort)=>{
        if(opt_sort==undefined){
            opt_sort="common";
        }
        let time_str="";
        if(opt_sort=="common"){
            time_str=his_json.i+":"+his_json.s;
            if(his_json.h!=0&&his_json.h!="00"){
                time_str=his_json.h+":"+time_str;
            }
        }else if(opt_sort=="hi"){
            time_str=his_json.h+":"+his_json.i;
        }else if(opt_sort=="full"){
            time_str=his_json.h+":"+his_json.i+":"+his_json.s;
        }
        return time_str;
    };
    this.get_ymd_to_y_m_d = (ymd_str) => {
        ymd_str = ymd_str + "";
        ymd_str = this.uncomma(ymd_str);
        let y_m_d = ymd_str.substring(0, 4);
        if (ymd_str.length >= 6) {
            y_m_d += "-" + ymd_str.substring(4, 6);
        } else {
            y_m_d += "-00-00";
            return y_m_d;
        }

        if (ymd_str.length >= 8) {
            y_m_d += "-" + ymd_str.substring(6, 8);
        } else {
            y_m_d += "-00";
            return y_m_d;
        }
        return y_m_d;
    };
    this.get_youtube_id_by_url = (url) => {
        const urlParams = new URL(url).searchParams;
        let video_id = urlParams.get('v');
        if (video_id == undefined) {
            video_id = "";
            if (url.indexOf("youtu.be/") != -1) {
                let tmp_url_arr = url.split("youtu.be/");
                if (tmp_url_arr.length == 2) {
                    video_id = tmp_url_arr[1];
                }
            }
        }
        return video_id;
    };
    this.get_vimeo_id_by_url = (url) => {
        url = url.split("?")[0];
        let split_url_arr = url.split("/");
        let video_id = split_url_arr[split_url_arr.length - 1];
        return video_id;
    };
    this.get_abc_arr = (len) => {
        let abc_arr = [];
        //65~90
        let added_cnt = 0;
        for (let row_i = 64; row_i <= 90; row_i++) {
            let pre_fix = "";
            if (row_i != 64) {
                pre_fix = String.fromCharCode(row_i);
            }
            for (let i = 65; i <= 90; i++) {
                abc_arr.push(pre_fix + String.fromCharCode(i));
                added_cnt++;
                if (added_cnt >= len) {
                    return abc_arr;
                }
            }
        }
        return abc_arr;
    };
    this.get_obj_by_key_val_at_obj_arr = (key, val, obj_arr) => {
        let select_obj_arr = [];
        for (let i = 0; i < obj_arr.length; i++) {
            let tmp_obj = obj_arr[i];
            if (tmp_obj[key] == val) {
                select_obj_arr.push(tmp_obj);
            }
        }
        return select_obj_arr;
    };
    this.set_storage = (key, val) => {
        localStorage.setItem(key, val);
    };
    this.get_storage = (key, default_val) => {
        if (default_val == undefined) { default_val = ""; }
        let val = localStorage.getItem(key);
        if (val == undefined || val == null) {
            val = "";
        }
        if (val == "") {
            val = default_val;
        }
        return val;
    };
    this.remove_storage = (key) => {
        localStorage.removeItem(key);
    };
    this.init();
};
var strFunc = new LygString();