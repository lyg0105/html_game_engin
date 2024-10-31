//var Model=require(global.LottoConstant.ABS+'model/base/model');
var StrFunc = require(global.LottoConstant.ABS + 'lib/lyg/string_func');
var mysql = require('mysql');

class Model {
  conn_info = {};
  last_error = null;
  last_id = "";
  constructor(in_opt_obj) {
    if (in_opt_obj == undefined) {
      in_opt_obj = {};
    }
    this.conn_info = {
      host: LottoConstant.DB_HOST,
      user: LottoConstant.DB_ID,
      password: LottoConstant.DB_PW,
      database: LottoConstant.DB_NAME,
      port: LottoConstant.DB_PORT,
      server_num: 'main',
      dateStrings: "date",
      connectionLimit: 50
    };
    for (var key in in_opt_obj) {
      this.conn_info[key] = in_opt_obj[key];
    }
  }

  async list(in_opt_obj) {
    var opt_obj = {
      t: '',//table
      g: '*',//get_column
      w: [],//where
      o: '',//one
      checkVal: true,//입력값검사
      debug: false,
      limit: [],
    };
    for (var key in in_opt_obj) {
      opt_obj[key] = in_opt_obj[key];
    }

    var get_col = opt_obj['g'];
    var table = opt_obj['t'];
    var where_arr = opt_obj['w'];
    var limit = opt_obj['limit'];
    var sql = "SELECT " + get_col + " FROM " + table + " WHERE 1=1";
    if (where_arr.length != 0) {
      var tmp_len = where_arr.length;
      for (var i = 0; i < tmp_len; i++) {
        sql += " " + where_arr[i] + " ";
      }
    }
    if (limit != "") {
      sql += " LIMIT " + limit[0] + ", " + limit[1] + " ";
    }
    if (opt_obj['debug']) {
      console.log(sql);
    }
    var excute_rs = await this.excute(sql);

    var info_arr = excute_rs.results;
    if (info_arr == undefined) {
      if (opt_obj['debug']) {
        console.log("model.list error:" + this.get_error());
      }
      return null;
    }
    //json형태로 변경
    var info_arr_len = info_arr.length;
    var tmp_info_arr = [];
    for (var i = 0; i < info_arr_len; i++) {
      var row_info = info_arr[i];
      var tmp_info = {};
      for (var key in row_info) {
        tmp_info[key] = row_info[key];
      }
      tmp_info_arr.push(tmp_info);
    }
    info_arr = tmp_info_arr;

    if (opt_obj['o']) {
      if (info_arr == null) {

      } else if (info_arr.length > 0) {
        info_arr = info_arr[0];
      } else {
        info_arr = null;
      }
    }
    return info_arr;
  }

  async insert(in_opt_obj) {
    var opt_obj = {
      t: '',//table
      col_val_arr: {},//key val arr
      checkVal: true,//입력값검사
      debug: false
    };
    for (var key in in_opt_obj) {
      opt_obj[key] = in_opt_obj[key];
    }

    var col_val_arr = opt_obj['col_val_arr'];
    var col_arr = [];
    var val_arr = [];
    var val_escape_arr = [];
    for (var key in col_val_arr) {
      col_arr.push(key);
      var val_str = col_val_arr[key];
      if (val_str == "null") {
        val_str = "null";
      } else {
        val_escape_arr.push(val_str);
        val_str = "?";
      }
      val_arr.push(val_str);
    }
    var col_str = col_arr.join(",");
    var val_str = val_arr.join(",");
    var val_escape_val = val_escape_arr.join(",");
    var sql = "INSERT INTO " + opt_obj['t'] + " (" + col_str + ") VALUES(" + val_str + ")";
    if (opt_obj['debug']) {
      console.log("debug:" + sql + " " + val_escape_val);
    }
    var excute_rs = await this.excute(sql, val_escape_arr);
    if (opt_obj['debug']) {
      if (excute_rs["error"]) {
        console.log(excute_rs["error"]);
      }
    }
    if (excute_rs.results && excute_rs.results.insertId != undefined) {
      this.last_id = excute_rs.results.insertId;
    }

    var is_success = true;
    if (excute_rs["error"]) {
      is_success = false;
    }

    return is_success;
  }

  async update(in_opt_obj) {
    var opt_obj = {
      t: '',//table
      col_val_arr: {},//key val arr
      pri_col_val_arr: null,//{}
      w: null,//[]
      checkVal: true,//입력값검사
      debug: false
    };
    for (var key in in_opt_obj) {
      opt_obj[key] = in_opt_obj[key];
    }

    if (opt_obj['pri_col_val_arr'] == null && opt_obj['w'] == null) {
      return false;
    }

    var up_arr = [];
    var up_where_arr = [];
    var val_escape_arr = [];
    if (opt_obj['pri_col_val_arr'] != null) {
      for (var key in opt_obj['pri_col_val_arr']) {
        opt_obj['pri_col_val_arr'][key] = StrFunc.checkInputStr(opt_obj['pri_col_val_arr'][key]);
        up_where_arr.push("AND " + key + "='" + opt_obj['pri_col_val_arr'][key] + "'");
      }
    }
    if (opt_obj['w'] != null) {
      for (var i = 0; i < opt_obj['w'].length; i++) {
        up_where_arr.push(opt_obj['w'][i]);
      }
    }
    for (var key in opt_obj['col_val_arr']) {
      var val_str = opt_obj['col_val_arr'][key];
      if (val_str == "null") {
        val_str = "null";
      } else {
        val_escape_arr.push(val_str);
        val_str = "?";
      }
      up_arr.push(key + "=" + val_str);
    }

    var up_str = up_arr.join(',');
    var val_escape_val = val_escape_arr.join(",");
    var sql = "UPDATE " + opt_obj['t'] + " SET " + up_str + " WHERE 1=1";
    for (var i = 0; i < up_where_arr.length; i++) {
      sql += " " + up_where_arr[i] + " ";
    }
    if (opt_obj['debug']) {
      console.log("debug:" + sql + " " + val_escape_val);
    }
    var excute_rs = await this.excute(sql, val_escape_arr);
    if (opt_obj['debug']) {
      if (excute_rs["error"]) {
        console.log(excute_rs["error"]);
      }
    }

    var is_success = true;
    if (excute_rs["error"]) {
      is_success = false;
    }

    return is_success;
  }
  async duplicate_update(in_opt_obj) {
    var opt_obj = {
      t: '',//table
      col_val_arr: {},//key val arr
      up_col_val_arr: null,//{}
      checkVal: true,//입력값검사
      debug: false
    };
    for (var key in in_opt_obj) {
      opt_obj[key] = in_opt_obj[key];
    }

    if (opt_obj['up_col_val_arr'] == null) {
      opt_obj['up_col_val_arr'] = opt_obj['col_val_arr'];
    }

    var val_escape_arr = [];
    var col_arr = [];
    var val_arr = [];
    var up_arr = [];
    for (var key in opt_obj['col_val_arr']) {
      col_arr.push(key);
      var val_str = opt_obj['col_val_arr'][key];
      if (val_str == "null") {
        val_str = "null";
      } else {
        val_escape_arr.push(val_str);
        val_str = "?";
      }
      val_arr.push(val_str);
    }
    for (var key in opt_obj['up_col_val_arr']) {
      var val_str = opt_obj['col_val_arr'][key];
      if (val_str == "null") {
        val_str = "null";
      } else {
        val_escape_arr.push(val_str);
        val_str = "?";
      }
      up_arr.push(key + "=" + val_str);
    }

    var val_escape_val = val_escape_arr.join(",");
    var col_str = col_arr.join(",");
    var val_str = val_arr.join(",");
    var up_str = up_arr.join(',');

    var sql = "INSERT INTO " + opt_obj['t'] + "(" + col_str + ") VALUES(" + val_str + ") ON DUPLICATE KEY UPDATE " + up_str;
    if (opt_obj['debug']) {
      console.log("debug:" + sql + " " + val_escape_val);
    }
    var excute_rs = await this.excute(sql, val_escape_val);
    if (opt_obj['debug']) {
      if (excute_rs["error"]) {
        console.log(excute_rs["error"]);
      }
    }

    var is_success = true;
    if (excute_rs["error"]) {
      is_success = false;
    }

    return is_success;
  }
  async delete(in_opt_obj) {
    var opt_obj = {
      t: '',//table
      pri_col_val_arr: null,//{}
      w: null,//[]
      checkVal: true,//입력값검사
      debug: false
    };
    for (var key in in_opt_obj) {
      opt_obj[key] = in_opt_obj[key];
    }

    if (opt_obj['pri_col_val_arr'] == null && opt_obj['w'] == null) {
      return false;
    }

    var up_where_arr = [];
    if (opt_obj['pri_col_val_arr'] != null) {
      for (var key in opt_obj['pri_col_val_arr']) {
        opt_obj['pri_col_val_arr'][key] = StrFunc.checkInputStr(opt_obj['pri_col_val_arr'][key]);
        up_where_arr.push("AND " + key + "='" + opt_obj['pri_col_val_arr'][key] + "'");
      }
    }
    if (opt_obj['w'] != null) {
      for (var i = 0; i < opt_obj['w'].length; i++) {
        up_where_arr.push(opt_obj['w'][i]);
      }
    }

    var sql = "DELETE FROM " + opt_obj['t'] + " WHERE 1=1";
    for (var i = 0; i < up_where_arr.length; i++) {
      sql += " " + up_where_arr[i] + " ";
    }
    if (opt_obj['debug']) {
      console.log("debug:" + sql);
    }
    var excute_rs = await this.excute(sql);
    if (opt_obj['debug']) {
      if (excute_rs["error"]) {
        console.log(excute_rs["error"]);
      }
    }

    var is_success = true;
    if (excute_rs["error"]) {
      is_success = false;
    }

    return is_success;
  }
  get_error() {
    return this.last_error;
  }
  excute(sql, val_arr) {
    if (val_arr == undefined) { val_arr = []; }
    var this_obj = this;
    return new Promise(function (resolve, reject) {
      global.LottoConstant.conn_pools[this_obj.conn_info.server_num].getConnection((error, connection) => {
        //use db
        if (!error) {
          connection.query('use ' + this_obj.conn_info.database, (error, results, fields) => {
            if (error) {
              this_obj.last_error = error;
              console.log(this_obj.last_error);
              resolve({
                'error': error,
                'results': results,
                'fields': fields
              });
            } else {
              // result
              connection.query(sql, val_arr, (error2, results2, fields2) => {
                if (error2) {
                  this_obj.last_error = error2;
                  console.log(this_obj.last_error);
                }
                resolve({
                  'error': error2,
                  'results': results2,
                  'fields': fields2
                });
                connection.release();  // 커넥션 풀에 커넥션 반환
              });
            }
          });
        } else {
          console.log(error);
          resolve({
            'error': error,
            'results': [],
            'fields': []
          });
        }

      });
    });
  }
}

module.exports = Model;