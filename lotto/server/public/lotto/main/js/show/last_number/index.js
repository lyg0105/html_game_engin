
class LastNumber
{
  static action(inData){
    let opt_obj={
      main:{},
      ...inData
    };
    let main=opt_obj.main;
    if(main.data.data.last_lotto_info==null){
      return false;
    }
    let last_lotto_info=main.data.data.last_lotto_info;
    //최근로또 날짜보여주기
    let lotto_number_sub_title=document.getElementById("lotto_number_sub_title");
    lotto_number_sub_title.innerHTML=last_lotto_info["drw_no_date"];

    //최근로또번호보여주기
    let lotto_number_con=document.getElementById("lotto_number_con");
    let number_div_arr=lotto_number_con.getElementsByClassName("lotto_number");
    number_div_arr[0].innerHTML=last_lotto_info["drwt_no1"];
    number_div_arr[1].innerHTML=last_lotto_info["drwt_no2"];
    number_div_arr[2].innerHTML=last_lotto_info["drwt_no3"];
    number_div_arr[3].innerHTML=last_lotto_info["drwt_no4"];
    number_div_arr[4].innerHTML=last_lotto_info["drwt_no5"];
    number_div_arr[5].innerHTML=last_lotto_info["drwt_no6"];
    
    number_div_arr[7].innerHTML=last_lotto_info["bnus_no"];
  }
}
export default LastNumber;