//import MyMath from "/common/js/math/index.js";
class MyMath{
  static random(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  }
}
export default MyMath;