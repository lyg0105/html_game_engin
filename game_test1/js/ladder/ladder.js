import LygLadderButton from './obj/ladder_button.js';
import LygLadderGameEvent from './event/event.js';
import LygLadderGamePageInput from './page/input_page.js';
import LygLadderGamePageLadder from './page/ladder_page.js';
import LygLadderGamePageResult from './page/result_page.js';
import LygLadderGamePageDraw from './draw/draw.js';
import LygLadderGameInputObj from './obj/input_obj.js';
/*
사다리게임 만들기

입력값받기
(사다리갯수,탑네임,바텀네임,사다리복잡도)

데이터세팅

결과계산

사다리 그리기

중간선 그리기

선택된거 그리기

선택된거 그리기 애니메이션

결과 확인
*/
class LygLadderGame
{
  opt={
    canvas_id:"ladder_game_canvas",
    canvas_obj:null,
    split_cnt:0,
    split_line_width:100,
    split_line_arr:[],//[{start:{x:0,y:0},end:{x:0,y:0}}]
    ladder_left_margin:25,
    ladder_top_margin:25,
    ladder_split_left_margin:10,
    top_name_arr:[],
    bottom_name_arr:[],
    mid_min_max_per_split:{
      min:1,
      max:4
    },
    mid_line_cnt_arr:[],
    mid_line_arr:[],//[{start:{x:0,y:0,idx:0},end:{x:1,y:1,idx:1}}]
    result_data:{}//[{line_num:0,top_name:"",bottom_name:""}]
  };
  screen={
    canvas_width:600,
    canvas_height:350,
    ladder_width:600,
    ladder_height:350,
    mouse_x:0,
    mouse_y:0
  };
  ctx=null;
  page_data={
    page_id:"input",//input,ladder,result
    line_arr:[],
    button_arr:[],
    input_obj:null
  };
  constructor(in_opt_obj){
    if(in_opt_obj==undefined){in_opt_obj={};}
    for(let key in in_opt_obj){
      this.opt[key]=in_opt_obj[key];
    }
    this.init();
  }
  init(){
    this.opt.canvas_obj=document.getElementById(this.opt.canvas_id);
    this.ctx=this.opt.canvas_obj.getContext("2d");
    let lygLadderGameEvent=new LygLadderGameEvent(this);
    lygLadderGameEvent.set_event();
    this.set_ladder_size();
    this.set_split_line_arr();
    this.set_mid_line_cnt();
    this.set_mid_line_arr();
    this.set_result();
    this.go_page("input");
  }
  set_ladder_size(){
    this.screen.ladder_width=this.screen.canvas_width-50;
    this.screen.ladder_height=this.screen.ladder_height-50;
  }
  set_split_line_arr(){
    //가운데선
    this.opt.split_line_arr=[];
    for(var i=0;i<this.opt.split_cnt;i++){
      var split_x=i*this.opt.split_line_width;
      split_x+=this.opt.ladder_left_margin;//시작왼쪽마진
      split_x+=i*this.opt.ladder_split_left_margin;//왼쪽마진
      split_x+=(this.opt.split_line_width-20)/2;
      var top_y=this.opt.ladder_top_margin+22;
      var bottom_y=this.screen.ladder_height-25;
      this.opt.split_line_arr.push({
        start:{
          x:split_x,
          y:top_y
        },
        end:{
          x:split_x,
          y:bottom_y
        }
      });
    }
  }
  set_text_btn(){
    let this_obj=this;
    //상단입력바버튼
    for(let split_i=0;split_i<this.opt.split_cnt;split_i++){
      let btn_x=this.opt.split_line_width*split_i;
      btn_x+=this.opt.ladder_left_margin;//시작왼쪽마진
      btn_x+=split_i*this.opt.ladder_split_left_margin;//왼쪽마진
      let btn_text="";
      if(this.opt.top_name_arr[split_i]!=undefined){
        btn_text=this.opt.top_name_arr[split_i];
      }
      var text_btn=new LygLadderButton({
        ladder_obj:this_obj,
        x:btn_x,
        y:this.opt.ladder_top_margin,
        width:this.opt.split_line_width-20,
        height:22,
        type:"text",//text,button,custom_button
        text:btn_text,
        target_id:"top_name_arr",
        target_idx:split_i,
        on_click:function(){
          LygLadderGameInputObj.add_input_obj({
            ladder:this_obj,
            x:btn_x,
            y:25,
            target_id:"top_name_arr",
            target_idx:split_i,
            value:this_obj.opt.top_name_arr[split_i],
            on_change:function(){
              this_obj.draw();
            }
          });
        }
      });
      this.page_data.button_arr.push(text_btn);
    }

    //하단입력바버튼
    for(let split_i=0;split_i<this.opt.split_cnt;split_i++){
      let btn_x=this.opt.split_line_width*split_i;
      btn_x+=this.opt.ladder_left_margin;//시작왼쪽마진
      btn_x+=split_i*this.opt.ladder_split_left_margin;//왼쪽마진
      let btn_text="";
      if(this.opt.bottom_name_arr[split_i]!=undefined){
        btn_text=this.opt.bottom_name_arr[split_i];
      }
      var text_btn=new LygLadderButton({
        ladder_obj:this_obj,
        x:btn_x,
        y:this.screen.ladder_height-25,
        width:this.opt.split_line_width-20,
        height:22,
        type:"text",//text,button,custom_button
        text:btn_text,
        target_id:"bottom_name_arr",
        target_idx:split_i,
        on_click:function(){
          LygLadderGameInputObj.add_input_obj({
            ladder:this_obj,
            x:btn_x,
            y:this_obj.screen.ladder_height-25,
            target_id:"bottom_name_arr",
            target_idx:split_i,
            value:this_obj.opt.bottom_name_arr[split_i],
            on_change:function(){
              this_obj.draw();
            }
          });
        }
      });
      this.page_data.button_arr.push(text_btn);
    }
    
  }

  set_mid_line_cnt(){
    this.opt.mid_line_cnt_arr=[];
    for(var i=0;i<this.opt.split_cnt-1;i++){
      let mid_line_cnt=this.random(
        this.opt.mid_min_max_per_split.min,
        this.opt.mid_min_max_per_split.max,
      );
      this.opt.mid_line_cnt_arr.push(mid_line_cnt);
    }
  }
  set_mid_line_arr(){
    this.opt.mid_line_arr=[];
    for(var line_i=0;line_i<this.opt.mid_line_cnt_arr.length;line_i++){
      let line_cnt=this.opt.mid_line_cnt_arr[line_i];
      var line_per_h=Math.floor(this.screen.ladder_height/line_cnt)
      for(var row_i=0;row_i<line_cnt;row_i++){
        let y_min_max={
          min:line_per_h*row_i,
          max:line_per_h*(row_i+1)
        };
        if(y_min_max.min==0){
          y_min_max.min=25+this.opt.ladder_top_margin;
        }
        if(y_min_max.max==this.screen.ladder_height){
          y_min_max.max-=25;
        }
        
        let start_y=this.random(y_min_max.min,y_min_max.max);
        let end_y=this.random(y_min_max.min,y_min_max.max);
        let mid_line={
          line_id:this.opt.mid_line_arr.length,
          start:{x:line_i,y:start_y,idx:line_i},
          end:{x:line_i+1,y:end_y,idx:line_i}
        };
        this.opt.mid_line_arr.push(mid_line);
      }
    }
  }
  set_result(){
    //[{line_num:0,top_name:"",bottom_name:""}]
    this.opt.result_data=[];
    //이름배열초기화
    if(this.opt.top_name_arr.length!=this.opt.split_cnt){
      for(var line_i=0;line_i<this.opt.split_cnt;line_i++){
        if(this.opt.top_name_arr[line_i]==undefined){
          this.opt.top_name_arr.push("");
        }
      }
    }
    if(this.opt.bottom_name_arr.length!=this.opt.split_cnt){
      for(var line_i=0;line_i<this.opt.split_cnt;line_i++){
        if(this.opt.bottom_name_arr[line_i]==undefined){
          this.opt.bottom_name_arr.push("");
        }
      }
    }

    for(var line_i=0;line_i<this.opt.split_cnt;line_i++){
      this.opt.result_data.push({
        start:{x:line_i,y:0},
        end:{x:line_i,y:0},
        moves:[],//[{x:0,y:0}]
        mid_line_ids:[],
        line_num:line_i,
        top_name:"",
        bottom_name:""
      });
      this.set_result_of_line_one(line_i);
    }
  }
  set_result_of_line_one(line_num){
    //이동경로등록
    this.opt.result_data[line_num].moves.push({
      x:this.opt.result_data[line_num].end.x,
      y:this.opt.result_data[line_num].end.y
    });
    //end의 y가 0일때까지 한다. 0이면 결과세팅
    if(this.opt.result_data[line_num].end.y>=this.screen.ladder_height){
      //끝데이터 세팅
      this.opt.result_data[line_num].top_name="TOP "+line_num;
      this.opt.result_data[line_num].bottom_name="BOTTOM "+this.opt.result_data[line_num].end.x;
      let end_line=this.opt.result_data[line_num].end.x;
      if(this.opt.top_name_arr[line_num]!=undefined){
        this.opt.result_data[line_num].top_name=this.opt.top_name_arr[line_num];
      }
      if(this.opt.bottom_name_arr[end_line]!=undefined){
        this.opt.result_data[line_num].bottom_name=this.opt.bottom_name_arr[end_line];
      }
    }else{
      //다음으로 이동
      var match_point={
        x:this.opt.result_data[line_num].end.x,
        y:this.screen.ladder_height,
        mid_line:{},
        st_end:"",//start,end
      };
      //매칭 라인 얻기
      for(var point_i=0;point_i<this.opt.mid_line_arr.length;point_i++){
        var mid_line=this.opt.mid_line_arr[point_i];

        //이미 했던라인인지 검사
        var is_no_has_mid_line=true;
        for(var i=0;i<this.opt.result_data[line_num].mid_line_ids.length;i++){
          if(mid_line.line_id==this.opt.result_data[line_num].mid_line_ids[i]){
            is_no_has_mid_line=false;
          }
        }
        if(is_no_has_mid_line==false){
          continue;
        }
        
        //같은라인인지 확인
        if(mid_line.start.x==this.opt.result_data[line_num].end.x
          ||mid_line.end.x==this.opt.result_data[line_num].end.x){
            if(mid_line.start.x==this.opt.result_data[line_num].end.x){
              //최소y인지 검사
              if(match_point.y<mid_line.start.y){
                continue;
              }
              if(mid_line.start.y<this.opt.result_data[line_num].end.y){
                continue;
              }
              match_point.x=mid_line.start.x;
              match_point.y=mid_line.start.y;
              match_point.mid_line=mid_line;
              match_point.st_end="start";
            }else{
              //최소y인지 검사
              if(match_point.y<mid_line.end.y){
                continue;
              }
              if(mid_line.end.y<this.opt.result_data[line_num].end.y){
                continue;
              }
              match_point.x=mid_line.end.x;
              match_point.y=mid_line.end.y;
              match_point.mid_line=mid_line;
              match_point.st_end="end";
            }
        }
      }

      if(match_point.st_end==""){
        //끝라인으로 맞추기
        this.opt.result_data[line_num].end.y=this.screen.ladder_height;
      }else{
        this.opt.result_data[line_num].mid_line_ids.push(match_point.mid_line.line_id);
        if(match_point.st_end=="start"){
          //이동경로등록
          this.opt.result_data[line_num].moves.push({
            x:match_point.mid_line.start.x,
            y:match_point.mid_line.start.y
          });
          this.opt.result_data[line_num].end.x=match_point.mid_line.end.x;
          this.opt.result_data[line_num].end.y=match_point.mid_line.end.y;
        }else if(match_point.st_end=="end"){
          //이동경로등록
          this.opt.result_data[line_num].moves.push({
            x:match_point.mid_line.end.x,
            y:match_point.mid_line.end.y
          });
          this.opt.result_data[line_num].end.x=match_point.mid_line.start.x;
          this.opt.result_data[line_num].end.y=match_point.mid_line.start.y;
        }
      }

      //반복
      this.set_result_of_line_one(line_num);
    }
  }
  reset_pagedata(){
    let this_obj=this;
    this.page_data.page_id="input";
    this.page_data.button_arr=[];
    this.page_data.line_arr=[];
    LygLadderGameInputObj.remmove_input_obj({ladder:this_obj});
  }
  draw_clear(){
    this.ctx.clearRect(0,0,this.screen.canvas_width,this.screen.canvas_height);
  }
  draw(){
    var this_obj=this;
    LygLadderGamePageDraw.action({
      ladder:this_obj
    });
  }
  draw_pick_line(line_num,top_bottom){

  }
  go_page(page_id){
    this.reset_pagedata();
    this.screen.page_id=page_id;
    var this_obj=this;
    
    switch(page_id){
      case "input":
        LygLadderGamePageInput.action({
          ladder:this_obj
        });
      break;
      case "ladder":
        LygLadderGamePageLadder.action({
          ladder:this_obj
        });
      break;
      case "result":
        LygLadderGamePageResult.action({
          ladder:this_obj
        });
      break;
      default:
        LygLadderGamePageInput.action({
          ladder:this_obj
        });
      break;
    }
  }
  random(min,max){
    let term=max-min;
    let real_min=min;
    if(term<0){
      term=-term;
      real_min=max;
    }
    // n/1=x/term (n/1)*term=x;
    let x=Math.random()*(term+1);
    x=Math.floor(x);
    x=x+real_min;
    return x;
  }
}

export default LygLadderGame;