class CharList{
  main;
  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
    let page_obj = main.model.data.page_obj;
    page_obj.data.char_arr=[];
    page_obj.data.char_cards=[];
    page_obj.data.select_slots=[];
    page_obj.data.scroll_index=0;
    page_obj.data.nav_arrows={left:null,right:null};
    let common_char_arr=main.model.data.object.common.char.data.char_list.char_arr;
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
    let slot_w=80;
    let slot_h=100;
    let slot_gap=20;
    let max_slots=3;
    let total_slot_w=max_slots*slot_w+(max_slots-1)*slot_gap;
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
      let sx=slot_start_x+i*(slot_w+slot_gap);
      let sy=slot_y;

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
        this_obj._draw_char_figure(ctx,sx+slot_w/2,sy+slot_h/2-10,12,26,'#4a90d9');
        ctx.save();
        ctx.fillStyle='#ffffff';
        ctx.font='11px Arial';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText(char_data.name,sx+slot_w/2,sy+slot_h-12);
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
    ctx.moveTo(40,slot_y+slot_h+15);
    ctx.lineTo(canvas_w-40,slot_y+slot_h+15);
    ctx.stroke();
    ctx.restore();

    // 캐릭터 목록 레이블
    let list_label_y=slot_y+slot_h+30;
    ctx.save();
    ctx.fillStyle='#aaaaaa';
    ctx.font='13px Arial';
    ctx.textAlign='left';
    ctx.textBaseline='middle';
    ctx.fillText('캐릭터 목록 (클릭하여 선택/해제)',40,list_label_y);
    ctx.restore();

    // ---- 캐릭터 카드 목록 ----
    let card_w=150;
    let card_h=180;
    let card_gap=25;
    let card_y=list_label_y+15;

    // 네비게이션 필요 여부 계산
    let avail_w_no_nav=canvas_w-80;
    let visible_no_nav=Math.floor((avail_w_no_nav+card_gap)/(card_w+card_gap));
    let need_nav=char_arr.length>visible_no_nav;

    // 보이는 카드 수 계산
    let scroll_index=page_obj.data.scroll_index||0;
    let visible_count;
    if(need_nav){
      let avail_w_nav=canvas_w-120; // 좌우 각 60px 여백
      visible_count=Math.max(1,Math.floor((avail_w_nav+card_gap)/(card_w+card_gap)));
    }else{
      visible_count=char_arr.length;
    }

    let max_scroll=Math.max(0,char_arr.length-visible_count);
    scroll_index=Math.max(0,Math.min(scroll_index,max_scroll));
    page_obj.data.scroll_index=scroll_index;
    page_obj.data.visible_count=visible_count;

    // 카드 시작 x (중앙 정렬)
    let visible_total_w=visible_count*card_w+(visible_count>1?(visible_count-1)*card_gap:0);
    let card_start_x=(canvas_w-visible_total_w)/2;

    // 네비게이션 화살표 그리기
    page_obj.data.nav_arrows={left:null,right:null};
    if(need_nav){
      let arrow_w=40;
      let arrow_h=70;
      let arrow_y=card_y+card_h/2-arrow_h/2;

      if(scroll_index>0){
        let lx=10;
        page_obj.data.nav_arrows.left={x:lx,y:arrow_y,width:arrow_w,height:arrow_h};
        this_obj._draw_nav_arrow(ctx,lx,arrow_y,arrow_w,arrow_h,'left');
      }
      if(scroll_index<max_scroll){
        let rx=canvas_w-10-arrow_w;
        page_obj.data.nav_arrows.right={x:rx,y:arrow_y,width:arrow_w,height:arrow_h};
        this_obj._draw_nav_arrow(ctx,rx,arrow_y,arrow_w,arrow_h,'right');
      }

      // 페이지 표시
      ctx.save();
      ctx.fillStyle='#778899';
      ctx.font='11px Arial';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText((scroll_index+1)+' / '+(max_scroll+1),canvas_w/2,card_y+card_h+18);
      ctx.restore();
    }

    // 카드 렌더링 (보이는 범위만)
    page_obj.data.char_cards=[];
    for(let i=0;i<visible_count;i++){
      let char_i=scroll_index+i;
      if(char_i>=char_arr.length) break;
      let char_data=char_arr[char_i];
      let cx=card_start_x+i*(card_w+card_gap);
      let cy=card_y;
      let is_selected=select_char_arr&&select_char_arr.some(function(c){return c&&c.id===char_data.id;});

      // 카드 hit area 저장
      page_obj.data.char_cards.push({x:cx,y:cy,width:card_w,height:card_h,char_data:char_data});

      // 카드 배경
      ctx.save();
      ctx.fillStyle=is_selected?'#1a3a5c':'#16213e';
      ctx.strokeStyle=is_selected?'#4a90d9':'#2a2a4a';
      ctx.lineWidth=is_selected?2:1;
      ctx.fillRect(cx,cy,card_w,card_h);
      ctx.strokeRect(cx,cy,card_w,card_h);
      ctx.restore();

      // 캐릭터 피규어
      this_obj._draw_char_figure(ctx,cx+card_w/2,cy+55,16,30,is_selected?'#4a90d9':'#8888aa');

      // 캐릭터 이름
      ctx.save();
      ctx.fillStyle='#ffffff';
      ctx.font='bold 13px Arial';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText(char_data.name,cx+card_w/2,cy+100);
      ctx.restore();

      // 구분선
      ctx.save();
      ctx.strokeStyle=is_selected?'#2a5080':'#1e2040';
      ctx.lineWidth=1;
      ctx.beginPath();
      ctx.moveTo(cx+10,cy+112);
      ctx.lineTo(cx+card_w-10,cy+112);
      ctx.stroke();
      ctx.restore();

      // 스탯
      let stats=[
        {label:'HP',value:char_data.hp},
        {label:'MP',value:char_data.mp},
        {label:'ATK',value:char_data.attack},
        {label:'DEF',value:char_data.defense},
      ];
      ctx.save();
      ctx.font='11px Arial';
      ctx.textBaseline='middle';
      for(let si=0;si<stats.length;si++){
        let stat_y=cy+122+si*14;
        ctx.fillStyle='#778899';
        ctx.textAlign='left';
        ctx.fillText(stats[si].label,cx+12,stat_y);
        ctx.fillStyle='#ccddee';
        ctx.textAlign='right';
        ctx.fillText(stats[si].value,cx+card_w-12,stat_y);
      }
      ctx.restore();

      // 선택됨 표시
      if(is_selected){
        ctx.save();
        ctx.fillStyle='#4a90d9';
        ctx.font='bold 11px Arial';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText('✓ 선택됨',cx+card_w/2,cy+card_h-12);
        ctx.restore();
      }
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
