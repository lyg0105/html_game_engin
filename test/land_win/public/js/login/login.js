class LygLoginFunc
{
  static login_data={
    token_id: "",
    client_info: {
      user_grade: "",
      user_id: "",
      user_name: "",
      user_seq: 0
    }
  };
  static get_login_data(){
    this.login_data = {
      token_id: "",
      client_info: {
        user_grade: "",
        user_id: "",
        user_name: "",
        user_seq: 0
      }
    };
    this.login_data.token_id=strFunc.get_storage("token_id");
    let client_info_str = strFunc.get_storage("client_info");
    if (!strFunc.is_empty(client_info_str)) {
      this.login_data.client_info = JSON.parse(client_info_str)
    }
    return this.login_data;
  }
}