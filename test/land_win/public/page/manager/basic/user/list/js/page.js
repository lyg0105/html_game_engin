class PageClass {
  info_arr=[];
  select_idx=-1;
  init_user_info={
    a_seq:"",
    a_user_id:"",
    a_user_pw:"",
    a_user_name:"",
    a_user_nickname:"",
    a_user_grade:"c",
    a_is_login:"1",
  };
  write_input_id_arr=[
    {id:"write_user_seq",key:"a_seq"},
    {id:"write_user_id",key:"a_user_id"},
    {id:"write_user_pw",key:"a_user_pw"},
    {id:"write_user_name",key:"a_user_name"},
    {id:"write_user_nickname",key:"a_user_nickname"},
    {id:"write_user_grade",key:"a_user_grade"},
    {id:"write_is_login",key:"a_is_login"},
  ];
  list() {
    let form_json_data = {
      api_token_id: strFunc.get_storage("token_id"),
      "now_page": "1",
      "num_per_page": "20",
      "order_id": "a_seq DESC",
    };
    let this_obj=this;
    let user_tbody = document.getElementById("user_tbody");
    user_tbody.innerHTML = "";
    fetch("/api/comp/user/user/list", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form_json_data),
    })
      .then((response) => {
        response.json()
          .then((result) => {
            if (result["result"] == "true") {
              this_obj.info_arr=result["data"]["info_arr"];
              this_obj.display_info_arr();
            } else {

            }
          });
      });
  }
  display_info_arr(){
    let this_obj=this;
    let user_tbody = document.getElementById("user_tbody");
    user_tbody.innerHTML = "";
    for (let i = 0; i < this_obj.info_arr.length; i++) {
      let info = this_obj.info_arr[i];

      let is_active=false;
      if(i==this_obj.select_idx){
        is_active=true;
      }

      let tr_style="";
      if(is_active){
        tr_style+="background:#1b5b1b;";
      }

      let tr_str = "<tr style=\""+tr_style+"\" ";
      tr_str+="onclick='pageClass.go_select_info("+i+");' ";
      tr_str+=">";
      tr_str += "<td>" + (i + 1) + "</td>";
      tr_str += "<td>" + info["a_user_id"] + "</td>";
      tr_str += "<td>" + info["a_user_name"] + "</td>";
      tr_str += "<td>" + info["a_user_nickname"] + "</td>";
      tr_str +=
        "<td>" +
        "<button class='btn_s btn_red' " +
        " onclick=\"pageClass.go_delete({pageClass:pageClass,pri_val_arr:[" + info["a_seq"] + "]});\">X</button>" +
        "</td>";
      tr_str += "</tr>";
      user_tbody.innerHTML += tr_str;
    }
  };
  go_select_info(info_idx){
    pageClass.select_idx=info_idx;
    pageClass.display_info_arr();
    let select_info=null;
    if(this.info_arr[this.select_idx]){
      select_info=this.info_arr[this.select_idx];
    }
    this.go_right_info_display(select_info);
  }
  go_right_info_display(select_info){
    let this_obj=this;
    select_info={
      ...this_obj.init_user_info,
      ...select_info
    };
    for(let i=0;i<this.write_input_id_arr.length;i++){
      let input_data=this.write_input_id_arr[i];
      let input_obj=document.getElementById(input_data.id);
      input_obj.value=select_info[input_data.key];
    }
  }
  get_right_info_by_input(){
    let this_obj=this;
    let row_data={};
    for(let i=0;i<this.write_input_id_arr.length;i++){
      let input_data=this.write_input_id_arr[i];
      let input_obj=document.getElementById(input_data.id);
      row_data[input_data.key]=input_obj.value;
    }
    return row_data;
  }
  
  go_delete(inData) {
    let opt_obj = {
      pageClass:null,
      pri_val_arr: [],
      ...inData
    };
    let pri_val_arr = [];
    for (let i = 0; i < opt_obj["pri_val_arr"].length; i++) {
      if (!strFunc.is_empty(opt_obj["pri_val_arr"][i])) {
        pri_val_arr.push(opt_obj["pri_val_arr"][i]);
      }
    }
    if (pri_val_arr.length == 0) {
      alert("키가 없습니다.");
      return false;
    }

    if (!confirm(pri_val_arr.length + "명 유저를 삭제 하시겠습니까?")) {
      return false;
    }

    let del_data_arr = [];
    for (let i = 0; i < pri_val_arr.length; i++) {
      del_data_arr.push({
        a_seq: pri_val_arr[i]
      });
    }

    let form_json_data = {
      api_token_id: strFunc.get_storage("token_id"),
      "data_arr": del_data_arr,
    };
    fetch("/api/comp/user/user/delete", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form_json_data),
    })
      .then((response) => {
        response.json()
          .then((result) => {
            if (result["result"] == "true") {
              alert(result["msg"]);
              opt_obj.pageClass.list();
            } else {
              alert(result["msg"]);
            }
          });
      });
  };
  go_write_right(){
    let row_data=this.get_right_info_by_input();
    if(row_data.a_user_id==""){
      alert("아이디 입력이 필요합니다.");
      return false;
    }
    if(row_data.a_user_name==""){
      alert("이름 입력이 필요합니다.");
      return false;
    }
    if(row_data.a_seq==""){
      if(row_data.a_user_pw==""){
        alert("암호 입력이 필요합니다.");
        return false;
      }
    }

    if(!confirm("저장 하시겠습니까?")){
      return false;
    }

    let form_json_data = {
      api_token_id: strFunc.get_storage("token_id"),
      "data_arr": [row_data],
    };
    if(row_data.a_seq==""){
      form_json_data["is_default_val"]="1";
    }else{
      form_json_data["is_update"]="1";
    }
    fetch("/api/comp/user/user/write", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form_json_data),
    })
      .then((response) => {
        response.json()
          .then((result) => {
            if (result["result"] == "true") {
              alert(result["msg"]);
              pageClass.list();
            } else {
              alert(result["msg"]);
            }
          });
      });
  }
}