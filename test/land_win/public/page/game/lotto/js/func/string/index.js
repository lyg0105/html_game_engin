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
  static str_replace(search, replace, content) {
    while (content.indexOf(search) != -1) {
      content = content.replace(search, replace);
    }
    return content;
  }
  static number(num_str){
    if(num_str==undefined||num_str==null||num_str==""){
      return 0;
    }
    num_str=num_str+"";
    let is_minus=false;
    if(num_str.split("-").length==2){
      is_minus=true;
    }
    num_str=num_str.replace(/[^0-9]/g,"");
    let num=Number(num_str);
    if(is_minus){
      num=num*-1;
    }
    return num;
  };
}
export default StringFunc;