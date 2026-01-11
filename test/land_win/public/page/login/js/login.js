window.onload = function () {
  on_load_window();
  let user_pw_input = document.getElementById("user_pw");
  user_pw_input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      go_login();
    }
  });
};

function on_load_window() {
  LygLoginFunc.get_login_data();
  if (!strFunc.is_empty(LygLoginFunc.login_data.token_id)
    && !strFunc.is_empty(LygLoginFunc.login_data.client_info["user_seq"])) {
    location.href = "/page/lobby";
    return false;
  }
}
function go_login() {
  let user_id_input = document.getElementById("user_id");
  let user_pw_input = document.getElementById("user_pw");

  if (user_id_input.value == "") {
    alert("아이디 입력 필요.");
    return false;
  }
  if (user_pw_input.value == "") {
    alert("암호 입력 필요.");
    return false;
  }

  fetch("/api/comp/user/login/login", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: user_id_input.value,
      pw: user_pw_input.value,
    }),
  })
    .then((response) => {
      response.json()
        .then((result) => {
          if (result["result"] == "true") {
            strFunc.set_storage("token_id", result["data"]["token_id"]);
            strFunc.set_storage("client_info", JSON.stringify(result["data"]["client_info"]));
            location.href = "/page/lobby";
          } else {
            alert(result["msg"]);
          }
        });
    });
}
function register() {
  location.href = '/page/join';
}