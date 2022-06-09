import LygLadderButton from '../obj/ladder_button.js';

class LygLadderGameAddInputObj
{
  static action(in_opt_obj){
    if(in_opt_obj==undefined){in_opt_obj={};}
    let opt_obj={
      ladder:null
    };
    for(let key in in_opt_obj){
      opt_obj[key]=in_opt_obj[key];
    }

    var this_obj=opt_obj.ladder;

    //실행버튼
    var excute_btn=new LygLadderButton({
      ladder_obj:this_obj,
      x:this_obj.screen.canvas_width/2-20-50,
      y:this_obj.screen.canvas_height-30,
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
    this_obj.page_data.button_arr.push(excute_btn);
    //결과버튼
    var result_btn=new LygLadderButton({
      ladder_obj:this_obj,
      x:this_obj.screen.canvas_width/2-20+50,
      y:this_obj.screen.canvas_height-30,
      width:70,
      height:22,
      type:"text",//text,button,custom_button
      text:"결과",
      target_id:"",
      target_idx:0,
      on_click:function(){
        console.log("결과페이지로가기");
        this_obj.go_page("result");
      }
    });
    this_obj.page_data.button_arr.push(result_btn);

    //입력바버튼
    opt_obj.ladder.set_text_btn();
    opt_obj.ladder.draw();
  }
  
}
export default LygLadderGameAddInputObj;