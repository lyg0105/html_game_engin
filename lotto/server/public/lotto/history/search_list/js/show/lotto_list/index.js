

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
      lotto_num_str_arr.push(`
        <span class="lotto_num_span">
          ${num}
        </span>
      `);
    }
    let lotto_num_str=lotto_num_str_arr.join(" ");
    let first_money=main.data.util.string.comma(lotto_info.first_winamnt);

    let html_str = `
      <tr>
        <td>${lotto_info.drw_no}</td>
        <td>${lotto_num_str}</td>
        <td>
          <span class="lotto_num_span">${lotto_info.bnus_no}</span>
        </td>
        <td>${first_money}</td>
        <td>${lotto_info.first_przwner_co}</td>
      </tr>`;
    return html_str;
  }
}
export default ShowLottoList;