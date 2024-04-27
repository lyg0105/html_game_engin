class LygMath{
  //LygMath.random(0,1);
  static random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //LygMath.plus_n_sum(1);
  static plus_n_sum(n){
    let sum_num=0;
    if(n<=0){
      return sum_num;
    }
    sum_num=(n*(n+1))/2;
    return sum_num;
  }
}