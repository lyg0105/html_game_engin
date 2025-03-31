import LottoDataFunc from "/lotto/common/js/func/data_func/index.js";

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
    //회차
    let lotto_title_num=document.getElementById("lotto_title_num");
    lotto_title_num.innerHTML=last_lotto_info["drw_no"];

    //최근로또번호보여주기
    let lotto_number_con=document.getElementById("lotto_number_con");
    let number_div_arr=lotto_number_con.getElementsByClassName("lotto_number");
    let match_num_data_arr=[
      {div_idx:0,num:last_lotto_info["drwt_no1"]},
      {div_idx:1,num:last_lotto_info["drwt_no2"]},
      {div_idx:2,num:last_lotto_info["drwt_no3"]},
      {div_idx:3,num:last_lotto_info["drwt_no4"]},
      {div_idx:4,num:last_lotto_info["drwt_no5"]},
      {div_idx:5,num:last_lotto_info["drwt_no6"]},
      {div_idx:7,num:last_lotto_info["bnus_no"]},
    ];
    for(let i=0;i<match_num_data_arr.length;i++){
      let row_match_num=match_num_data_arr[i];
      let lotto_num=row_match_num.num;
      let lotto_num_div=number_div_arr[row_match_num.div_idx];
      lotto_num_div.innerHTML=lotto_num;
      lotto_num_div.style.color="#fff";
      lotto_num_div.style.background=LottoDataFunc.get_color_by_num(lotto_num);
    }
  }
}
export default LastNumber;