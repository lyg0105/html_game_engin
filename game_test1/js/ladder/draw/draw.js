class LygLadderGamePageDraw
{
  static action(in_opt_obj){
    if(in_opt_obj==undefined){in_opt_obj={};}
    let opt_obj={
      ladder:null
    };
    for(let key in in_opt_obj){
      opt_obj[key]=in_opt_obj[key];
    }

    opt_obj.ladder.draw_clear();
    opt_obj.ladder.ctx.save();
    
    if(opt_obj.ladder.screen.page_id=="result"){
      console.log(opt_obj.ladder.opt.result_data);
      let result_len=opt_obj.ladder.opt.result_data.length;
      for(let result_i=0;result_i<result_len;result_i++){
        let result_row=opt_obj.ladder.opt.result_data[result_i];
        opt_obj.ladder.ctx.save();
        let draw_x=100;
        let draw_y=30*result_i+25;
        //배경
        opt_obj.ladder.ctx.fillStyle="green";
        opt_obj.ladder.ctx.fillRect(draw_x,draw_y,100,25);
        opt_obj.ladder.ctx.fillStyle="lime";
        opt_obj.ladder.ctx.fillRect(draw_x+100+60+5,draw_y,100,25);
        opt_obj.ladder.ctx.restore();
        //텍스트
        opt_obj.ladder.ctx.font="14px Arial";
        opt_obj.ladder.ctx.fillStyle="black";
        opt_obj.ladder.ctx.textAlign="center";
        let text_x=draw_x+50;
        let text_y=draw_y+20;
        opt_obj.ladder.ctx.fillText(result_row["top_name"],text_x,text_y);
        //화살표
        opt_obj.ladder.ctx.fillText("=>",text_x+80,text_y);
        //결과
        opt_obj.ladder.ctx.fillText(result_row["bottom_name"],text_x+60+50+50+5,text_y);

        opt_obj.ladder.ctx.restore();
      }
    }else{
      //입력바버튼
      opt_obj.ladder.set_text_btn();
      for(let btn_i=0;btn_i<opt_obj.ladder.page_data.button_arr.length;btn_i++) {
        opt_obj.ladder.page_data.button_arr[btn_i].draw(opt_obj.ladder.ctx);
      }

      //가운데선
      for(let split_i=0;split_i<opt_obj.ladder.opt.split_line_arr.length;split_i++){
        let split_line=opt_obj.ladder.opt.split_line_arr[split_i];
        opt_obj.ladder.ctx.moveTo(split_line.start.x,split_line.start.y);
        opt_obj.ladder.ctx.lineTo(split_line.end.x,split_line.end.y);
        opt_obj.ladder.ctx.stroke();
        opt_obj.ladder.ctx.restore();
      }

      //가로선
      if(opt_obj.ladder.screen.page_id=="ladder"){
        var mid_line_cnt=opt_obj.ladder.opt.mid_line_arr.length;
        for(let mid_i=0;mid_i<mid_line_cnt;mid_i++){
          var mid_line=opt_obj.ladder.opt.mid_line_arr[mid_i];
          var start_p=mid_line["start"];
          var end_p=mid_line["end"];

          let start_x=opt_obj.ladder.opt.split_line_width*start_p.x;
          start_x+=opt_obj.ladder.opt.ladder_left_margin;//시작왼쪽마진
          start_x+=start_p.x*opt_obj.ladder.opt.ladder_split_left_margin;//왼쪽마진
          start_x+=(opt_obj.ladder.opt.split_line_width-20)/2;//가운데로
          let end_x=opt_obj.ladder.opt.split_line_width*end_p.x;
          end_x+=opt_obj.ladder.opt.ladder_left_margin;//시작왼쪽마진
          end_x+=end_p.x*opt_obj.ladder.opt.ladder_split_left_margin;//왼쪽마진
          end_x+=(opt_obj.ladder.opt.split_line_width-20)/2;//가운데로
          opt_obj.ladder.ctx.beginPath();
          opt_obj.ladder.ctx.moveTo(start_x,start_p.y);
          opt_obj.ladder.ctx.lineTo(end_x,end_p.y);
          opt_obj.ladder.ctx.stroke();
          opt_obj.ladder.ctx.restore();
        }
      }
    }

    //버튼
    for(let btn_i=0;btn_i<opt_obj.ladder.page_data.button_arr.length;btn_i++){
      opt_obj.ladder.page_data.button_arr[btn_i].draw(opt_obj.ladder.ctx);
    }

    opt_obj.ladder.ctx.restore();
  }
  
}
export default LygLadderGamePageDraw;