
class ControlMain{
  main=null;
  constructor(main){
    this.main=main;
  }
  async get_last_lotto_by_ajax(){
    let this_obj=this;
    let form_json_data={
      "order_id":"drw_no DESC",
      "is_need_count":"",
      "is_need_info_arr":"1",
      "is_no_limit":"1",
      "max_limit_num":"1",
    };
    let list_rs=await this_obj.main.data.util.fetch.send({
      url: "/api/lotto/number_list/list",
      data: form_json_data,
    });
    if(list_rs["result"]=="true"){
      if(list_rs["data"]["info_arr"].length>0){
        this_obj.main.data.data.last_lotto_info=list_rs["data"]["info_arr"][0];
      }
    }else{
      alert(list_rs["msg"]);
    }
  };
}
export default ControlMain;