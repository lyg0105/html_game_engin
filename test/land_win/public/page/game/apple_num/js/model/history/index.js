class History {
  main;
  data = {
    hoverItem: null,
    scrollOffset: 0,
    itemHeight: 50,
    maxVisible: 8
  };
  constructor(main) {
    this.main = main;
  }
  async saveScoreAtServer(inData) {
    let this_obj= this;
    let main=this_obj.main;
    let opt_obj={
      score_row_arr:[],
      ...inData
    };
    let score_row_arr=opt_obj.score_row_arr;
    let write_score_arr=[];
    let now_ymd=main.model.data.util.date.get_date_format(new Date(),"Ymd");
    let now_ymdhis=main.model.data.util.date.get_date_format(new Date(),"Y-m-d h:i:s");
    for(let i=0;i<score_row_arr.length;i++){
      let tmp_row=score_row_arr[i];
      let write_score_row={
        a_ymd:now_ymd,
        a_seq:"",
        a_date:now_ymdhis,
        a_id:"apple_num",
        a_user_name:tmp_row.name,
        a_score:tmp_row.score,
        a_correct:tmp_row.correct,
        a_time_sec:tmp_row.time_sec,
      };
      if(localStorage.token_id){
        write_score_row.a_is_login_user="1";
        //write_score_row.a_user_seq="";
      }
      write_score_arr.push(write_score_row);
    }

    let form_json_data={
      data_arr:write_score_arr,
      is_default_val:"1",
    };

    let response = await main.model.data.util.fetch.send({
      method: 'POST',
      url: "/api/comp/game/score_history/write",
      data:form_json_data,
    });
    if(response.result=="true"){
      this_obj.getScoreListAtServer();
    }else{
      alert("점수 저장에 실패했습니다.");
    }
  }
  async getScoreListAtServer(){
    let this_obj= this;
    let main=this_obj.main;
    let response = await main.model.data.util.fetch.send({
      method: 'POST',
      url: "/api/comp/game/score_history/list",
      data: {
        order_id:"a_score DESC",
        s_par_id:"apple_num",
        is_paging:"",
        max_limit_num:10,
      },
    });
    if(response.result=="true"){
      main.model.data.game_score_list = [];
      for(let i=0;i<response.data.info_arr.length;i++){
        let tmp_info=response.data.info_arr[i];
        let add_score_row={
          ...main.model.data.default_score_row,
          name:tmp_info.a_user_name,
          score:tmp_info.a_score,
          correct:tmp_info.a_correct,
          time_sec:tmp_info.a_time_sec,
          date:tmp_info.a_date,
        };
        main.model.data.game_score_list.push(add_score_row);
      }
    }
  }
  setHoverItem(itemId) {
    this.data.hoverItem = itemId;
  }
  getItemAt(x, y) {
    const canvasData = this.main.model.data.canvas;
    const list = this.main.model.data.game_score_list;
    const startY = 120;
    const itemHeight = this.data.itemHeight;
    const itemWidth = 500;
    const startX = (canvasData.width - itemWidth) / 2;

    // 뒤로가기 버튼
    if (x >= 20 && x <= 100 && y >= 20 && y <= 60) {
      return { id: 'back', type: 'button' };
    }

    // 리스트 아이템
    for (let i = 0; i < Math.min(list.length, this.data.maxVisible); i++) {
      const itemY = startY + i * itemHeight;
      if (x >= startX && x <= startX + itemWidth &&
          y >= itemY && y <= itemY + itemHeight - 5) {
        return { id: i, type: 'item' };
      }
    }
    return null;
  }
  render() {
    const data = this.main.model.data;
    const ctx = data.html.ctx;
    const canvasData = data.canvas;
    const list = data.game_score_list;

    // 타이틀
    ctx.fillStyle = '#e94560';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('기록 확인', canvasData.width / 2, 60);

    // 뒤로가기 버튼
    const isBackHover = this.data.hoverItem === 'back';
    ctx.fillStyle = isBackHover ? '#e94560' : '#0f3460';
    ctx.beginPath();
    ctx.roundRect(20, 20, 80, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('뒤로', 60, 40);

    // 리스트
    const startY = 120;
    const itemHeight = this.data.itemHeight;
    const itemWidth = 500;
    const startX = (canvasData.width - itemWidth) / 2;

    if (list.length === 0) {
      ctx.fillStyle = '#888';
      ctx.font = '20px Arial';
      ctx.fillText('기록이 없습니다.', canvasData.width / 2, canvasData.height / 2);
      return;
    }

    // 헤더
    ctx.fillStyle = '#0f3460';
    ctx.beginPath();
    ctx.roundRect(startX, startY - 40, itemWidth, 35, 5);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('순위', startX + 30, startY - 22);
    ctx.fillText('개수', startX + 90, startY - 22);
    ctx.fillText('점수', startX + 190, startY - 22);
    ctx.fillText('시간', startX + 290, startY - 22);
    ctx.fillText('날짜', startX + 400, startY - 22);

    // 아이템들
    for (let i = 0; i < Math.min(list.length, this.data.maxVisible); i++) {
      const item = list[i];
      const itemY = startY + i * itemHeight;
      const isHover = this.data.hoverItem === i;

      // 배경
      ctx.fillStyle = isHover ? '#2a2a4a' : (i % 2 === 0 ? '#1a1a2e' : '#252542');
      ctx.beginPath();
      ctx.roundRect(startX, itemY, itemWidth, itemHeight - 5, 5);
      ctx.fill();

      // 텍스트
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(i + 1, startX + 30, itemY + itemHeight / 2 - 2);
      ctx.fillText(item.correct || 0, startX + 90, itemY + itemHeight / 2 - 2);
      ctx.fillText(item.score, startX + 190, itemY + itemHeight / 2 - 2);
      ctx.fillText(item.time_sec + '초', startX + 290, itemY + itemHeight / 2 - 2);
      ctx.fillText(item.date.substring(0, 10), startX + 400, itemY + itemHeight / 2 - 2);
    }

    // 총 기록 수
    if (list.length > this.data.maxVisible) {
      ctx.fillStyle = '#888';
      ctx.font = '14px Arial';
      ctx.fillText(`총 ${list.length}개의 기록`, canvasData.width / 2, canvasData.height - 30);
    }
  }
}
export default History;
