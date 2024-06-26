class StringFunc {
  str_in_array(search_str, str_arr) {
    var is_match = -1;
    for (var i = 0; i < str_arr.length; i++) {
      if (str_arr[i] == search_str) {
        is_match = true;
      }
    }
    return is_match;
  }
  str_replace(search, replace, content) {
    while (content.indexOf(search) != -1) {
      content = content.replace(search, replace);
    }
    return content;
  }
}
export default StringFunc;