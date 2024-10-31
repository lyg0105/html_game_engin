//var ConvertPrefixKey=require(global.LottoConstant.ABS+'model/base/func/convertPrefixKey');
class ConvertPrefixKey
{
  static getConvertedPrefixInfoArr(info_arr,prefix,change_prefix){
    var result_info_arr=[];
    var info_arr_len=info_arr.length;
    for(var i=0;i<info_arr_len;i++){
      var col_val_arr=info_arr[i];
      var col_val_arr2=this.getConvertedPrefixColValArr(col_val_arr,prefix,change_prefix);
      result_info_arr.push(col_val_arr2);
    }
    return result_info_arr;
  }
  static getConvertedPrefixColValArr(col_val_arr,prefix,change_prefix){
    var result_col_val_arr={};
    for(var key in col_val_arr){
      var key2=this.replacePrefixStr(key,prefix,change_prefix);
      result_col_val_arr[key2]=col_val_arr[key];
    }
    return result_col_val_arr;
  }
  static replacePrefixStr(key,prefix,change_prefix){
    var result_str=key;
    if(prefix!=""&&key.length>prefix.length){
      if(key.substr(0,prefix.length)==prefix){
        result_str=key.substr(prefix.length);
        result_str=change_prefix+result_str;
      }
    }
    return result_str;
  }
}
module.exports=ConvertPrefixKey;