class CharList{
  main;
  constructor(main) {
    this.main = main;
  }
  init() {
    let main = this.main;
    let page_obj = main.model.data.page_obj;
    page_obj.data.char_arr=[];
    page_obj.data.char_cards=[];
    page_obj.data.select_slots=[];
    page_obj.data.scroll_index=0;
    page_obj.data.nav_arrows={left:null,right:null};
    let common_char_arr=main.model.data.game_data.char_arr;
    for(let char_i=0;char_i<common_char_arr.length;char_i++){
      page_obj.data.char_arr.push(common_char_arr[char_i]);
    }
  }
  render() {
    let this_obj = this;
    let main = this.main;
    let page_obj = main.model.data.page_obj;
    let char_arr=page_obj.data.char_arr;
    let select_char_arr=page_obj.data.select_char_arr;
    let ctx=main.model.data.html.ctx;
    let canvas_w=main.model.data.canvas.width;
    let canvas_h=main.model.data.canvas.height;

    // 배경
    ctx.save();
    ctx.fillStyle='#1a1a2e';
    ctx.fillRect(0,0,canvas_w,canvas_h-68);
    ctx.restore();

    // 타이틀
    ctx.save();
    ctx.fillStyle='#ffffff';
    ctx.font='bold 24px Arial';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText('캐릭터 선택',canvas_w/2,22);
    ctx.restore();

    // ---- 선택 슬롯 (상단) ----
    let max_slots=10;
    let slot_gap=6;
    let row_gap=8;
    // 화면 너비에 따라 1행(10개) 또는 2행(5개) 결정
    let slot_cols=((canvas_w-20-9*slot_gap)/10)>=50?10:5;
    let slot_rows=max_slots/slot_cols;
    let slot_w=Math.min(75,Math.floor((canvas_w-20-(slot_cols-1)*slot_gap)/slot_cols));
    let slot_h=Math.floor(slot_w*1.3);
    let slot_area_h=slot_rows*slot_h+(slot_rows>1?(slot_rows-1)*row_gap:0);
    let total_slot_w=slot_cols*slot_w+(slot_cols-1)*slot_gap;
    let slot_start_x=(canvas_w-total_slot_w)/2;
    let slot_y=60;

    ctx.save();
    ctx.fillStyle='#aaaaaa';
    ctx.font='13px Arial';
    ctx.textAlign='left';
    ctx.textBaseline='middle';
    ctx.fillText('선택된 캐릭터',slot_start_x,slot_y-12);
    ctx.restore();

    page_obj.data.select_slots=[];
    for(let i=0;i<max_slots;i++){
      let col=i%slot_cols;
      let row=Math.floor(i/slot_cols);
      let sx=slot_start_x+col*(slot_w+slot_gap);
      let sy=slot_y+row*(slot_h+row_gap);

      ctx.save();
      ctx.fillStyle='#0d0d1a';
      ctx.strokeStyle='#4a90d9';
      ctx.lineWidth=2;
      ctx.fillRect(sx,sy,slot_w,slot_h);
      ctx.strokeRect(sx,sy,slot_w,slot_h);
      ctx.restore();

      if(select_char_arr&&select_char_arr[i]){
        let char_data=select_char_arr[i];
        // hit area 저장 (캐릭터 있는 슬롯만)
        page_obj.data.select_slots.push({x:sx,y:sy,width:slot_w,height:slot_h,index:i});
        this_obj._draw_char_figure(ctx,sx+slot_w/2,sy+slot_h/2-8,9,20,'#4a90d9');
        ctx.save();
        ctx.fillStyle='#ffffff';
        ctx.font='10px Arial';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText(char_data.name,sx+slot_w/2,sy+slot_h-10);
        ctx.restore();
        // X 버튼 힌트
        ctx.save();
        ctx.fillStyle='rgba(180,60,60,0.8)';
        ctx.font='bold 11px Arial';
        ctx.textAlign='right';
        ctx.textBaseline='top';
        ctx.fillText('✕',sx+slot_w-4,sy+4);
        ctx.restore();
      }else{
        ctx.save();
        ctx.fillStyle='#334466';
        ctx.font='26px Arial';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText('+',sx+slot_w/2,sy+slot_h/2);
        ctx.restore();
      }
    }

    // 구분선
    ctx.save();
    ctx.strokeStyle='#444466';
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(40,slot_y+slot_area_h+15);
    ctx.lineTo(canvas_w-40,slot_y+slot_area_h+15);
    ctx.stroke();
    ctx.restore();

    // 캐릭터 목록 레이블
    let list_label_y=slot_y+slot_area_h+30;
    ctx.save();
    ctx.fillStyle='#aaaaaa';
    ctx.font='13px Arial';
    ctx.textAlign='left';
    ctx.textBaseline='middle';
    ctx.fillText('캐릭터 목록 (클릭하여 선택/해제)',40,list_label_y);
    ctx.restore();

    // ---- 캐릭터 카드 목록 (그리드) ----
    let card_margin=20;
    let card_gap=8;
    // 화면 너비에 따라 열 수 자동 결정 (카드 최소 너비 55px 기준)
    let card_cols=Math.max(2,Math.floor((canvas_w-card_margin+card_gap)/(55+card_gap)));
    let card_w=Math.floor((canvas_w-card_margin-(card_cols-1)*card_gap)/card_cols);
    let card_h=Math.floor(card_w*1.3);
    let card_x_start=(canvas_w-(card_cols*card_w+(card_cols-1)*card_gap))/2;
    let card_y=list_label_y+15;

    // 표시 가능한 행 수 계산
    let avail_h=canvas_h-68-card_y-10;
    let rows_visible=Math.max(1,Math.floor((avail_h+card_gap)/(card_h+card_gap)));

    // 행 단위 스크롤
    let scroll_row=page_obj.data.scroll_index||0;
    let total_rows=Math.ceil(char_arr.length/card_cols);
    let max_scroll=Math.max(0,total_rows-rows_visible);
    scroll_row=Math.max(0,Math.min(scroll_row,max_scroll));
    page_obj.data.scroll_index=scroll_row;
    page_obj.data.max_scroll=max_scroll;
    page_obj.data.visible_count=card_cols;

    // 네비게이션 화살표 (그리드 하단 중앙)
    page_obj.data.nav_arrows={left:null,right:null};
    if(max_scroll>0){
      let grid_bottom=card_y+rows_visible*(card_h+card_gap);
      let arrow_w=28;
      let arrow_h=24;
      let arrow_y=grid_bottom+4;
      if(scroll_row>0){
        let lx=canvas_w/2-55-arrow_w;
        page_obj.data.nav_arrows.left={x:lx,y:arrow_y,width:arrow_w,height:arrow_h};
        this_obj._draw_nav_arrow(ctx,lx,arrow_y,arrow_w,arrow_h,'left');
      }
      if(scroll_row<max_scroll){
        let rx=canvas_w/2+55;
        page_obj.data.nav_arrows.right={x:rx,y:arrow_y,width:arrow_w,height:arrow_h};
        this_obj._draw_nav_arrow(ctx,rx,arrow_y,arrow_w,arrow_h,'right');
      }
      ctx.save();
      ctx.fillStyle='#778899';
      ctx.font='11px Arial';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText((scroll_row+1)+' / '+(max_scroll+1),canvas_w/2,arrow_y+arrow_h/2);
      ctx.restore();
    }

    // 카드 렌더링
    page_obj.data.char_cards=[];
    page_obj.data.char_card_delete_btns=[];
    let head_r=Math.max(6,Math.floor(card_w*0.12));
    let body_h_fig=Math.max(14,Math.floor(card_w*0.25));
    let name_size=Math.max(10,Math.floor(card_w*0.13));
    for(let i=0;i<rows_visible*card_cols;i++){
      let char_i=scroll_row*card_cols+i;
      if(char_i>=char_arr.length) break;
      let char_data=char_arr[char_i];
      let col=i%card_cols;
      let row=Math.floor(i/card_cols);
      let cx=card_x_start+col*(card_w+card_gap);
      let cy=card_y+row*(card_h+card_gap);
      let is_selected=select_char_arr&&select_char_arr.some(function(c){return c&&c.id===char_data.id;});

      page_obj.data.char_cards.push({x:cx,y:cy,width:card_w,height:card_h,char_data:char_data});

      // X 버튼 히트 영역 등록
      let del_btn_size=Math.max(16,Math.floor(card_w*0.25));
      let del_bx=cx+card_w-del_btn_size;
      let del_by=cy;
      page_obj.data.char_card_delete_btns.push({x:del_bx,y:del_by,width:del_btn_size,height:del_btn_size,char_data:char_data});

      // 카드 배경
      ctx.save();
      ctx.fillStyle=is_selected?'#1a3a5c':'#16213e';
      ctx.strokeStyle=is_selected?'#4a90d9':'#2a2a4a';
      ctx.lineWidth=is_selected?2:1;
      ctx.fillRect(cx,cy,card_w,card_h);
      ctx.strokeRect(cx,cy,card_w,card_h);
      ctx.restore();

      // 캐릭터 피규어
      this_obj._draw_char_figure(ctx,cx+card_w/2,cy+card_h*0.33,head_r,body_h_fig,is_selected?'#4a90d9':'#8888aa');

      // 캐릭터 이름
      ctx.save();
      ctx.fillStyle='#ffffff';
      ctx.font='bold '+name_size+'px Arial';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText(char_data.name,cx+card_w/2,cy+card_h*0.55);
      ctx.restore();

      // 직업 · 종족
      let sub_size=Math.max(8,name_size-1);
      let sub_text=[char_data.job,char_data.race].filter(Boolean).join(' · ');
      if(sub_text){
        ctx.save();
        ctx.fillStyle='#aabbcc';
        ctx.font=sub_size+'px Arial';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText(sub_text,cx+card_w/2,cy+card_h*0.72);
        ctx.restore();
      }

      // 선택됨 표시
      if(is_selected){
        ctx.save();
        ctx.fillStyle='#4a90d9';
        ctx.font='bold '+sub_size+'px Arial';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText('✓',cx+card_w/2,cy+card_h*0.90);
        ctx.restore();
      }

      // X 버튼 (카드 내용 위에 마지막으로 그림)
      ctx.save();
      ctx.fillStyle='#cc2222';
      ctx.fillRect(del_bx,del_by,del_btn_size,del_btn_size);
      ctx.strokeStyle='#ff6666';
      ctx.lineWidth=1;
      ctx.strokeRect(del_bx,del_by,del_btn_size,del_btn_size);
      ctx.fillStyle='#ffffff';
      ctx.font='bold '+Math.floor(del_btn_size*0.65)+'px Arial';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText('✕',del_bx+del_btn_size/2,del_by+del_btn_size/2);
      ctx.restore();
    }
  }

  _draw_nav_arrow(ctx,x,y,w,h,dir){
    ctx.save();
    // 버튼 배경 (둥근 사각형)
    ctx.fillStyle='rgba(74,144,217,0.25)';
    ctx.strokeStyle='#4a90d9';
    ctx.lineWidth=2;
    let r=8;
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.lineTo(x+w-r,y);
    ctx.arcTo(x+w,y,x+w,y+r,r);
    ctx.lineTo(x+w,y+h-r);
    ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
    ctx.lineTo(x+r,y+h);
    ctx.arcTo(x,y+h,x,y+h-r,r);
    ctx.lineTo(x,y+r);
    ctx.arcTo(x,y,x+r,y,r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // 화살표 삼각형
    ctx.fillStyle='#ffffff';
    ctx.beginPath();
    if(dir==='left'){
      ctx.moveTo(x+w*0.65,y+h*0.25);
      ctx.lineTo(x+w*0.25,y+h*0.5);
      ctx.lineTo(x+w*0.65,y+h*0.75);
    }else{
      ctx.moveTo(x+w*0.35,y+h*0.25);
      ctx.lineTo(x+w*0.75,y+h*0.5);
      ctx.lineTo(x+w*0.35,y+h*0.75);
    }
    ctx.fill();
    ctx.restore();
  }

  _draw_char_figure(ctx,cx,cy,head_r,body_h,color){
    ctx.save();
    ctx.fillStyle=color;
    // 머리
    ctx.beginPath();
    ctx.arc(cx,cy-body_h/2-head_r,head_r,0,Math.PI*2);
    ctx.fill();
    // 몸통
    ctx.fillRect(cx-head_r*0.8,cy-body_h/2,head_r*1.6,body_h);
    ctx.restore();
  }
}
export default CharList;
