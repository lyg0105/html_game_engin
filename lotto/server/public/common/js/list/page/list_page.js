//import ListPage from "/common/js/list/page/index.js";
class ListPage {
  data = {
    now_page: 1,
    block_size: 5,
    total_rec: 0,
    num_per_page: 20,

    start_num: 0,
    end_num: 0,
    st_end_num_arr: [],
    max_end_num: 0,
    st_limit: 0,
    before_block: 0,
    next_block: 0,
    total_page: 0,

    is_view_num_per_page: false,
    is_show_start_end: false,
    is_show_prev_next: true,
    is_show_total_rec: true,

    onChangePage: (now_page) => { },
    onChangeNumPerPage: (num_per_page) => { },
  };
  constructor(inData) {
    this.init(inData);
  }
  init(inData) {
    let this_obj = this;
    this.data = {
      ...this_obj.data,
      ...inData
    };
    // 1 - 현재 페이지 설정
    if (this_obj.data.now_page == 0 || isNaN(this_obj.data.now_page)) { this_obj.data.now_page = 1; }
    // 3 - 각 블럭의 start 페이지 값을 설정한다
    if (this_obj.data.now_page % this_obj.data.block_size == 0) {
      this_obj.data.start_num = this_obj.data.now_page - this_obj.data.block_size + 1;    // 현재 페이지가 블럭의 마지막 페이지 일 경우 해당 블럭의 시작 페이지 번호를 정한다
    } else {
      this_obj.data.start_num = Math.floor(this_obj.data.now_page / this_obj.data.block_size) * this_obj.data.block_size + 1; // 현재페이지가 블럭의 마지막 페이지가 아닐경우 시작 페이지를 지정한다
    }
    // 4 - 각 블럭의 end 페이지 값을 설정한다
    this_obj.data.end_num = this_obj.data.start_num + this_obj.data.block_size - 1;
    
    // 5 -- 총 개수

    // 7 - 불러오기 쿼리문에서 시작레코드 숫자 지정 ex(  limit($st_limit, $num_per_page)
    if (this_obj.data.now_page == 1) {
      this_obj.data.st_limit = 0;
    } else {
      this_obj.data.st_limit = (this_obj.data.now_page * this_obj.data.num_per_page) - this_obj.data.num_per_page;
    }
    // 8 - 이전 블럭 설정
    this_obj.data.before_block = this_obj.data.start_num - 1;
    
    // 9 - 다음 블럭 설정
    this_obj.data.next_block = this_obj.data.start_num + this_obj.data.block_size;
    //전체 페이지 개수를 구한다.
    this_obj.data.total_page = Math.ceil(this_obj.data.total_rec / this_obj.data.num_per_page) < 1 ? 1 : Math.ceil(this_obj.data.total_rec / this_obj.data.num_per_page);
    //페이징 배열세팅
    let st_end_num_arr = [];
    this_obj.data.max_end_num = Math.ceil(this_obj.data.total_rec / this_obj.data.num_per_page);
    for (let i = this_obj.data.start_num; i <= this_obj.data.end_num; i++) {
      if (this_obj.data.max_end_num >= i) {
        st_end_num_arr.push(i);
      }
    }
    this_obj.data.st_end_num_arr = st_end_num_arr;
  };

  onChangePage(now_page) {
    this.onChangePage(now_page);
  };
  onChangeNumPerPage(num_per_page) {
    this.onChangeNumPerPage(num_per_page);
    this.init();
  };
  get_page_num_btn_arr() {
    let this_obj = this;
    let num_btn_arr = [];
    for (let i = 0; i < this.data.st_end_num_arr.length; i++) {
      let add_li=document.createElement("li");
      let add_btn=document.createElement("button");
      add_btn.style.minWidth="30px";
      add_btn.style.height="30px";

      let number = this.data.st_end_num_arr[i];
      let num_class_name = "btn";
      if (number == this_obj.data.now_page) {
        num_class_name = "btn active";
        add_btn.style.color="#00f";
        add_btn.style.backgroundColor="#a4ffac";
        add_btn.style.fontWeight="bold";
      }
      
      add_btn.className=num_class_name;
      add_btn.addEventListener("click",function(){this_obj.data.onChangePage(number);});
      add_btn.innerHTML=number;
      add_li.appendChild(add_btn);
      num_btn_arr.push(add_li);
    }
    return num_btn_arr;
  };
  get_paging_div(){
    let this_obj = this;
    let paging_div=document.createElement("div");
    paging_div.className="paging_div";
    let ul=document.createElement("ul");
    ul.style.display="flex";
    ul.style.listStyleType="none";
    ul.style.padding="0px";
    ul.style.margin="0px";
    ul.style.justifyContent="center";
    ul.style.alignItems="center";
    ul.style.gap="6px";
    if(this_obj.data.is_show_prev_next&&this_obj.data.before_block>0){
      let prev_li=document.createElement("li");
      let prev_btn=document.createElement("button");
      prev_btn.className="btn";
      prev_btn.addEventListener("click",function(){this_obj.data.onChangePage(this_obj.data.before_block);});
      prev_btn.innerHTML="&lt;";
      prev_li.appendChild(prev_btn);
      ul.appendChild(prev_li);
    }
    let num_btn_arr=this_obj.get_page_num_btn_arr();
    for(let i=0;i<num_btn_arr.length;i++){
      ul.appendChild(num_btn_arr[i]);
    }
    if(this_obj.data.is_show_prev_next&&this_obj.data.next_block<=this_obj.data.max_end_num){
      let next_li=document.createElement("li");
      let next_btn=document.createElement("button");
      next_btn.className="btn";
      next_btn.addEventListener("click",function(){this_obj.data.onChangePage(this_obj.data.next_block);});
      next_btn.innerHTML="&gt;";
      next_li.appendChild(next_btn);
      ul.appendChild(next_li);
    }
    paging_div.appendChild(ul);
    return paging_div;
  }

};
export default ListPage;