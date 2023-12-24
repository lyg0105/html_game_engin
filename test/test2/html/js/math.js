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

  //a_num,b_num is number
  //cal_sort="+" or "-"
  //return [0,0,0];
  static get_up_num_arr_by_a_b_plus_minus=(a_num,b_num,cal_sort)=>{
    let up_num_arr=[];
    let a_num_str=a_num+"";
    let b_num_str=b_num+"";
    let a_num_arr=a_num_str.split("");
    let b_num_arr=b_num_str.split("");
    let max_up_len=a_num_arr.length;
    if(b_num_arr.length>max_up_len){
      max_up_len=b_num_arr.length;
    }
    for(let i=max_up_len-1;i>=0;i--){
      up_num_arr.push(0);
    }
    let is_up_num=false;
    for(let i=max_up_len-1;i>=0;i--){
      if(is_up_num){
        if(cal_sort=="+"){
          up_num_arr[i]=1;
        }else if(cal_sort=="-"){
          up_num_arr[i]=a_num_arr[i]-1;
        }
      }
      if(a_num_arr[i]==undefined||b_num_arr[i]==undefined){
        continue;
      }

      a_num_arr[i]=parseInt(a_num_arr[i]);
      b_num_arr[i]=parseInt(b_num_arr[i]);
      
      is_up_num=false;
      if(cal_sort=="+"){
        if(a_num_arr[i]+b_num_arr[i]>=10){
          is_up_num=true;
        }
      }else if(cal_sort=="-"){
        if(a_num_arr[i]<b_num_arr[i]){
          if(a_num_arr[i-1]!=undefined){
            if(a_num_arr[i-1]){
              is_up_num=true;
              up_num_arr[i]=10;
            }
          }
        }
      }
    }
    if(is_up_num){
      if(cal_sort=="+"){
        up_num_arr.unshift(1);
      }else{
        up_num_arr.unshift(0);
      }
    }else{
      up_num_arr.unshift(0);
    }
    
    return up_num_arr;
  };
}