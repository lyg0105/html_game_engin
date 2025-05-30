import LottoDataFunc from "/lotto/common/js/func/data_func/index.js";

class SelectNumPopup{
  static show(inData){
    let opt_obj={
      main:null,
      num_sort:"include_num_arr",//except_num_arr,make_num_arr
      ...inData
    };
    let this_obj=this;
    let main=opt_obj.main;
    let num_sort=opt_obj.num_sort;
    main.data.popup.data.content_element.innerHTML="";
    main.data.popup.setTitle("번호선택");
    let num_btn_wrap=document.createElement("div");
    num_btn_wrap.className="option_con";
    for(let i=1;i<=45;i++){
      let num_btn=document.createElement("div");
      num_btn.innerHTML=i;
      num_btn.className="lotto_number";
      if(main.data.util.string.str_in_array(i,main.data.data[num_sort])!=-1){
        let num_color = LottoDataFunc.get_color_by_num(i);
        num_btn.style.backgroundColor=num_color;
        num_btn.style.color="white";
      }
      num_btn.addEventListener("click",function(){
        if(main.data.util.string.str_in_array(i,main.data.data[num_sort])==-1){
          main.data.data[num_sort].push(i);
        }else{
          main.data.data[num_sort]=main.data.util.string.remove_str_in_array(i,main.data.data[num_sort]);
        }
        main.show.show({main:main});
        this_obj.show({main:main,num_sort:num_sort});
      });
      num_btn_wrap.appendChild(num_btn);
    }
    main.data.popup.data.content_element.appendChild(num_btn_wrap);

    //관리버튼
    let manage_btn_wrap=document.createElement("div");
    manage_btn_wrap.style.marginTop="10px";
    manage_btn_wrap.style.textAlign="center";
    let init_num_btn=document.createElement("button");
    init_num_btn.innerHTML="초기화";
    init_num_btn.addEventListener("click",function(){
      main.data.data[num_sort]=[];
      main.show.show({main:main});
      this_obj.show({main:main,num_sort:num_sort});
    });
    manage_btn_wrap.appendChild(init_num_btn);
    main.data.popup.data.content_element.appendChild(manage_btn_wrap);

    main.data.popup.show();
  }
}
export default SelectNumPopup;