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
class LadderGame
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
      max:3
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
    this.set_event();
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
        x:btn_x,
        y:this.opt.ladder_top_margin,
        width:this.opt.split_line_width-20,
        height:22,
        type:"text",//text,button,custom_button
        text:btn_text,
        target_id:"top_name_arr",
        target_idx:split_i,
        on_click:function(){
          this_obj.add_input_obj({
            x:btn_x,
            y:25,
            target_id:"top_name_arr",
            target_idx:split_i,
            value:this_obj.opt.top_name_arr[split_i],
            on_change:function(){
              this_obj.draw_ladder();
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
        x:btn_x,
        y:this.screen.ladder_height-25,
        width:this.opt.split_line_width-20,
        height:22,
        type:"text",//text,button,custom_button
        text:btn_text,
        target_id:"bottom_name_arr",
        target_idx:split_i,
        on_click:function(){
          this_obj.add_input_obj({
            x:btn_x,
            y:this_obj.screen.ladder_height-25,
            target_id:"bottom_name_arr",
            target_idx:split_i,
            value:this_obj.opt.bottom_name_arr[split_i],
            on_change:function(){
              this_obj.draw_ladder();
            }
          });
        }
      });
      this.page_data.button_arr.push(text_btn);
    }
  }
  set_event(){
    var this_obj=this;
    this.opt.canvas_obj.addEventListener("mousemove", function(e){
      this_obj.screen.mouse_x=e.offsetX;
      this_obj.screen.mouse_y=e.offsetY;
      this_obj.on_hover_button();
    });
    this.opt.canvas_obj.addEventListener("click", function(e){
      this_obj.screen.mouse_x=e.offsetX;
      this_obj.screen.mouse_y=e.offsetY;
      this_obj.on_click_button();
    });
  }
  on_hover_button(){
    let btn_cnt=this.page_data.button_arr.length;
    var is_in_hover=false;
    for(let btn_i=0;btn_i<btn_cnt;btn_i++){
      let btn=this.page_data.button_arr[btn_i];
      if(btn.is_enter_mouse(this.screen.mouse_x,this.screen.mouse_y)){
        is_in_hover=true;
      }
    }
    if(is_in_hover){
      this.opt.canvas_obj.style.cursor='pointer';
    }else{
      this.opt.canvas_obj.style.cursor='';
    }
  }
  on_click_button(){
    let btn_cnt=this.page_data.button_arr.length;
    for(let btn_i=0;btn_i<btn_cnt;btn_i++){
      let btn=this.page_data.button_arr[btn_i];
      if(btn.is_enter_mouse(this.screen.mouse_x,this.screen.mouse_y)){
        btn.opt.on_click();
      }
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
      if(this.opt.top_name_arr[line_num]!=undefined){
        this.opt.result_data[line_num].top_name=this.opt.top_name_arr[line_num];
      }
      if(this.opt.bottom_name_arr[line_num]!=undefined){
        this.opt.result_data[line_num].bottom_name=this.opt.bottom_name_arr[line_num];
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
    this.page_data.page_id="input";
    this.page_data.button_arr=[];
    this.page_data.line_arr=[];
    this.remmove_input_obj();
  }
  draw_clear(){
    this.ctx.clearRect(0,0,this.screen.canvas_width,this.screen.canvas_height);
  }
  draw_ladder(){
    this.draw_clear();
    this.ctx.save();
    var this_obj=this;
    //입력바버튼
    this.set_text_btn();
    for(let btn_i=0;btn_i<this.page_data.button_arr.length;btn_i++) {
      this.page_data.button_arr[btn_i].draw(this.ctx);
    }

    //가운데선
    for(let split_i=0;split_i<this.opt.split_line_arr.length;split_i++){
      let split_line=this.opt.split_line_arr[split_i];
      this.ctx.moveTo(split_line.start.x,split_line.start.y);
      this.ctx.lineTo(split_line.end.x,split_line.end.y);
      this.ctx.stroke();
      this.ctx.restore();
    }

    //실행버튼
    var excute_btn=new LygLadderButton({
      x:this.screen.canvas_width/2-20,
      y:this.screen.canvas_height-30,
      width:70,
      height:22,
      type:"text",//text,button,custom_button
      text:"실행",
      target_id:"",
      target_idx:0,
      on_click:function(){
        console.log("실행페이지로가기");
        this_obj.go_page("ladder");
      }
    });
    this.page_data.button_arr.push(excute_btn);
    excute_btn.draw(this.ctx);
    //결과보기

    this.ctx.restore();
  }
  draw_mid_lines(){
    this.ctx.save();
    var this_obj=this;

    var mid_line_cnt=this.opt.mid_line_arr.length;
    for(let mid_i=0;mid_i<mid_line_cnt;mid_i++){
      var mid_line=this.opt.mid_line_arr[mid_i];
      var start_p=mid_line["start"];
      var end_p=mid_line["end"];

      let start_x=this.opt.split_line_width*start_p.x;
      start_x+=this.opt.ladder_left_margin;//시작왼쪽마진
      start_x+=start_p.x*this.opt.ladder_split_left_margin;//왼쪽마진
      start_x+=(this.opt.split_line_width-20)/2;//가운데로
      let end_x=this.opt.split_line_width*end_p.x;
      end_x+=this.opt.ladder_left_margin;//시작왼쪽마진
      end_x+=end_p.x*this.opt.ladder_split_left_margin;//왼쪽마진
      end_x+=(this.opt.split_line_width-20)/2;//가운데로
      this.ctx.beginPath();
      this.ctx.moveTo(start_x,start_p.y);
      this.ctx.lineTo(end_x,end_p.y);
      this.ctx.stroke();
      this.ctx.restore();
    }

    this.ctx.restore();
  }
  draw_pick_line(line_num,top_bottom){

  }
  go_page(page_id){
    this.reset_pagedata();
    this.screen.page_id=page_id;
    switch(page_id){
      case "input":this.draw_input_page();
      break;
      case "ladder":this.draw_ladder_page();
      break;
      case "result":this.draw_result_page();
      break;
      default:this.draw_input_page();
      break;
    }
  }
  draw_input_page(){
    this.draw_ladder();
  }
  draw_ladder_page(){
    this.draw_ladder();
    this.draw_mid_lines();
  }
  draw_result_page(){

  }
  add_input_obj(in_opt_obj){
    if(in_opt_obj==undefined){in_opt_obj={};}
    var btn_opt_obj={
      x:0,
      y:0,
      target_id:"",
      target_idx:0,
      value:"",
      on_change:function(){
        console.log("Chaage");
      }
    };
    for(let key in in_opt_obj){
      btn_opt_obj[key]=in_opt_obj[key];
    }
    btn_opt_obj["target_idx"]=parseInt(btn_opt_obj["target_idx"]);
    var this_obj=this;
    this.remmove_input_obj();
    var input_obj=document.createElement("INPUT");
    this.opt.canvas_obj.parentElement.appendChild(input_obj);
    input_obj.type="text";
    input_obj.id="lyg_ladder_input";
    input_obj.style.width="80px";
    input_obj.style.height="22px";
    input_obj.style.border="0px";
    input_obj.style.textAlign="center";
    input_obj.style.position="absolute";
    input_obj.style.left=btn_opt_obj.x+"px";
    input_obj.style.top=btn_opt_obj.y+"px";
    input_obj.style.opacity=0.5;
    input_obj.target_id=btn_opt_obj.target_id;
    input_obj.target_idx=btn_opt_obj.target_idx;
    input_obj.value=btn_opt_obj.value;
    input_obj.focus();
    this.page_data.input_obj=input_obj;

    input_obj.onkeydown=function(e){
      if(e.keyCode==9){
        return false;
      }
    }
    input_obj.onblur=function(){
      if(this_obj.page_data.input_obj!=null){
        if(this_obj.opt[btn_opt_obj["target_id"]]){
          this_obj.opt[btn_opt_obj["target_id"]][btn_opt_obj["target_idx"]]=input_obj.value;
        }
        this_obj.remmove_input_obj();
        btn_opt_obj.on_change();
      }
    }
    input_obj.onkeyup=function(e){
      btn_opt_obj.on_change();
      if(e.keyCode==13||e.keyCode==9){
        console.log("Next");
      }
    }
  }
  remmove_input_obj(){
    this.page_data.input_obj=null;
    if(document.getElementById("lyg_ladder_input")){
      document.getElementById("lyg_ladder_input").remove();
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

class LygLadderButton{
  opt={
    x:0,
    y:0,
    width:100,
    height:22,
    type:"button",//text,button,custom_button
    text:"",
    background_color:"yellow",
    font:"14px Arial",
    font_style:"black",
    on_click:function(){
      console.log("클릭");
    }
  };
  
  constructor(in_opt_obj){
    if(in_opt_obj==undefined){in_opt_obj={};}
    for(let key in in_opt_obj){
      this.opt[key]=in_opt_obj[key];
    }
  }
  draw(ctx){
    ctx.save();
    //배경
    ctx.fillStyle=this.opt.background_color;
    ctx.fillRect(this.opt.x,this.opt.y,this.opt.width,this.opt.height);
    ctx.restore();
    //텍스트
    ctx.font=this.opt.font;
    ctx.fillStyle=this.opt.font_style;
    ctx.textAlign="textAlign=center";
    let text_x=this.opt.x+this.opt.width/2;
    text_x-=String(this.opt.text).length*3;
    ctx.fillText(this.opt.text,text_x,this.opt.y+this.opt.height/2+5);
    ctx.restore();
  }
  is_enter_mouse(x,y){
    if(x>=this.opt.x&&x<=this.opt.x+this.opt.width){
      if(y>=this.opt.y&&y<=this.opt.y+this.opt.height){
        return true;
      }
    }
    return false;
  }

}