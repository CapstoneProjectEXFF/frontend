/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */
$(document).ready(() => {
  $("#form").submit((event) => {
    event.preventDefault();
    if (validate()) {
      let username = $("#username").val();
      let password = $("#password").val();
      let api = loginAdmin(username, password, loginSuccess, loginFails);
    }
  });
  $("#username").focusout(() => {
    checkRegex('#username', /^[a-zA-Z0-9]{9,11}$/);
  });
  $("#password").focusout(() => {
    checkRegex('#password', /^.{8,50}$/);
  });
});



function validate() {
  return checkRegex('#username', /^[a-zA-Z0-9]{9,11}$/) && checkRegex('#password', /^.{8,50}$/);
}

function loginSuccess(data) {
  window.location.replace("./admin.html");
}

function loginFails(err) {
  $("#errorNotif").show();
}
