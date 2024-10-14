class LygString
{
  static setStorage(key, value){
    localStorage.setItem(key, value);
  }
  static getStorage(key,defaultVal){
    let value=localStorage.getItem(key);
    if(value==null){
      value=defaultVal;
    }
    return value;
  }
}
export default LygString;