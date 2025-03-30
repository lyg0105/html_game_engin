import ListPage from "/common/js/list/page/list_page.js";
import LottoDataFunc from "/lotto/common/js/func/data_func/index.js";

class ShowLottoList {
  static show(inData) {
    let opt_obj = {
      main: {},
      ...inData
    };
    let this_obj = this;
    let main = opt_obj.main;
    let lotto_info_arr = main.data.data.lotto_info_arr;
    let lotto_list_body = document.getElementById("lotto_list_body");
    lotto_list_body.innerHTML = "";
    let show_lotto_info_arr = [];
    let start_num = (main.data.list_opt.now_page - 1) * main.data.list_opt.num_per_page;
    let end_num = start_num + main.data.list_opt.num_per_page;
    main.data.list_opt
    for (let i = 0; i < lotto_info_arr.length; i++) {
      if (i >= start_num && i < end_num) {
        show_lotto_info_arr.push(lotto_info_arr[i]);
      }
    }
    if (show_lotto_info_arr.length == 0) {
      lotto_list_body.innerHTML = `<tr><td colspan="6" class="text-center">내용없음</td></tr>`;
      return;
    }

    let html_str_arr = [];
    for (let i = 0; i < show_lotto_info_arr.length; i++) {
      let lotto_info = show_lotto_info_arr[i];
      let html_str = this_obj.get_lotto_tr({
        main: main,
        lotto_info: lotto_info
      });
      html_str_arr.push(html_str);
    }
    let html_str = html_str_arr.join("");
    lotto_list_body.innerHTML = html_str;

    // 페이징 처리
    /**/
    let list_page = new ListPage({
      now_page: main.data.list_opt.now_page,
      total_rec: lotto_info_arr.length,
      num_per_page: main.data.list_opt.num_per_page,
      is_show_prev_next: true,
      is_show_total_rec: true,
      is_show_start_end: false,
      onChangePage: (now_page) => {
        main.data.list_opt.now_page = now_page;
        this_obj.show(inData);
      }
    });
    let lotto_list_paging_div=document.getElementById("lotto_list_paging_div");
    lotto_list_paging_div.innerHTML = "";
    lotto_list_paging_div.appendChild(list_page.get_paging_div());
    
  }
  static get_lotto_tr(inData) {
    let opt_obj = {
      main: {},
      lotto_info: {},
      ...inData
    };
    let main= opt_obj.main;
    let lotto_info = opt_obj.lotto_info;
    let lotto_num_str_arr = [];
    let lotto_num_arr = [
      lotto_info.drwt_no1,
      lotto_info.drwt_no2,
      lotto_info.drwt_no3,
      lotto_info.drwt_no4,
      lotto_info.drwt_no5,
      lotto_info.drwt_no6
    ];
    for(let i=0;i<lotto_num_arr.length;i++){
      let num=lotto_num_arr[i];
      let num_color=LottoDataFunc.get_color_by_num(num);

      lotto_num_str_arr.push(`
        <span class="lotto_num_span" style="background:${num_color};">
          ${num}
        </span>
      `);
    }
    let lotto_num_str=lotto_num_str_arr.join(" ");
    let bonus_num_color=LottoDataFunc.get_color_by_num(lotto_info.bnus_no);
    let first_money=parseInt(main.data.util.string.uncomma(lotto_info.first_winamnt));
    let millon_money=0;
    if(first_money>0){
      millon_money=first_money/100000000;
      millon_money=millon_money.toFixed(1);
    }

    let html_str = `
      <tr>
        <td>
          ${lotto_info.drw_no}
          <div style="font-size:10px;" >${lotto_info.drw_no_date}</div>
        </td>
        <td>${lotto_num_str}</td>
        <td>
          <span class="lotto_num_span" style="background:${bonus_num_color}" >${lotto_info.bnus_no}</span>
        </td>
        <td>${millon_money}억</td>
        <td>${lotto_info.first_przwner_co}</td>
      </tr>`;
    return html_str;
  }
}
export default ShowLottoList;