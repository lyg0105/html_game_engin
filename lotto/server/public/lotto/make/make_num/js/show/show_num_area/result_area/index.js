import ShowNumArr from "../show_num/index.js";

class ResultArea {
  static show(inData) {
    let opt_obj = {
      main: {},
      ...inData
    };
    let this_obj = this;
    
    let make_num_match_arr=opt_obj.main.data.data.make_num_match_arr;
    let make_num_div=document.getElementById("make_num_div");
    make_num_div.innerHTML="";
    for(let i=0;i<make_num_match_arr.length;i++){
      let make_num_match=make_num_match_arr[i];
      let make_num_row_wrap=document.createElement("div");
      make_num_row_wrap.style.marginTop="10px";
      make_num_row_wrap.style.border="1px solid #ccc";
      make_num_row_wrap.style.borderRadius="5px";
      make_num_row_wrap.style.padding="5px 0px";

      //관리
      let manage_div=document.createElement("div");
      manage_div.className="option_con";
      //del
      let show_detail_btn=document.createElement("button");
      show_detail_btn.className="btn";
      show_detail_btn.innerHTML="상세보기";
      show_detail_btn.onclick=function(){
        make_num_match.is_show_detail=!make_num_match.is_show_detail;
        this_obj.show({
          main:opt_obj.main,
        });
      };
      manage_div.appendChild(show_detail_btn);
      //show_detail btn
      let remove_btn=document.createElement("button");
      remove_btn.className="btn";
      remove_btn.innerHTML="Del";
      remove_btn.onclick=function(){
        make_num_match_arr.splice(i,1);
        this_obj.show({
          main:opt_obj.main,
        });
      };
      manage_div.appendChild(remove_btn);
      make_num_row_wrap.appendChild(manage_div);

      //title
      let title_div=document.createElement("div");
      title_div.style.textAlign="center";
      title_div.style.marginTop="5px";
      title_div.innerHTML=make_num_match.top_rank+"등 ";
      if(make_num_match.top_rank_data){
        title_div.innerHTML+=" "+make_num_match.top_rank_data.lotto_idx+"회차 "+make_num_match.top_rank_data.date;
      }
      make_num_row_wrap.appendChild(title_div);

      let make_num_row_div = document.createElement("div");
      make_num_row_div.className="option_con";
      ShowNumArr.show({
        ...opt_obj,
        div_obj: make_num_row_div,
        num_arr:make_num_match.num_arr,
      });
      make_num_row_wrap.appendChild(make_num_row_div);

      //상세
      if(make_num_match.is_show_detail){
        let detail_div = this_obj.get_detail_div({
          ...opt_obj,
          make_num_match: make_num_match,
        });
        make_num_row_wrap.appendChild(detail_div);
      }

      make_num_div.appendChild(make_num_row_wrap);
    }
  }
  static get_detail_div(inData) {
    let opt_obj = {
      main: {},
      make_num_match:{},
      ...inData
    };
    let make_num_match=opt_obj.make_num_match;
    let detail_div=document.createElement("div");
    detail_div.className="option_con";
    let match_arr=make_num_match.match_arr;
    for(let i=0;i<match_arr.length;i++){
      let match_data=match_arr[i];

      let detail_row_div=document.createElement("div");
      detail_row_div.style.padding="5px";
      detail_row_div.style.border="1px solid #ccc";
      detail_row_div.style.borderRadius="5px";
      detail_row_div.style.marginTop="5px";

      let title_div=document.createElement("div");
      title_div.style.textAlign="center";
      title_div.innerHTML=match_data.rank+"등 "+match_data.lotto_idx+"회차 "+match_data.date;
      detail_row_div.appendChild(title_div);

      let match_row_div=document.createElement("div");
      match_row_div.className="option_con";
      let is_bonus_color=false;
      if(match_data.rank==2){
        is_bonus_color=true;
      }
      ShowNumArr.show({
        ...opt_obj,
        div_obj: match_row_div,
        num_arr:match_data.lotto_num_arr,
        is_match_color:true,
        match_num_arr:match_data.num_arr,
        match_color:"green",
        bonus_num:match_data.bonus_num,
        is_bonus_color:is_bonus_color,
      });
      detail_row_div.appendChild(match_row_div);
      detail_div.appendChild(detail_row_div);
    }
    return detail_div;
  }
}
export default ResultArea;