import LygLadderButton from '../obj/ladder_button.js';

class LygLadderGamePageResult
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
    
    //처음으로
    var result_btn=new LygLadderButton({
      ladder_obj:this_obj,
      x:this_obj.screen.canvas_width/2-20,
      y:this_obj.screen.canvas_height-30,
      width:70,
      height:22,
      type:"text",//text,button,custom_button
      text:"처음으로",
      target_id:"",
      target_idx:0,
      on_click:function(){
        console.log("처음으로");
        this_obj.go_page("input");
      }
    });
    this_obj.page_data.button_arr.push(result_btn);

    opt_obj.ladder.draw();
  }
}
export default LygLadderGamePageResult;