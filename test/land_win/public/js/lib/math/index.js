class MathFunc {
  // min 이상 max 이하 정수 반환
  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
export default MathFunc;