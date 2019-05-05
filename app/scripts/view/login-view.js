/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */
$(document).ready(() => {
  $("#form").submit((event) => {
    event.preventDefault();
    if (validate()) {
      let phoneNumber = $("#phoneNumber").val();
      let password = $("#password").val();
      let api = login(phoneNumber, password, loginSuccess, loginFails);
    }
  });
  $("#phoneNumber").focusout(() => {
    checkRegex('#phoneNumber', /^[0-9]{9,11}$/);
  });
  $("#password").focusout(() => {
    checkRegex('#password', /^.{8,50}$/);
  });
});



function validate() {
  return checkRegex('#phoneNumber', /^[0-9]{9,11}$/) && checkRegex('#password', /^.{8,50}$/);
}

function loginSuccess(data) {
  window.location.replace("./index.html");
}

function loginFails(err) {
  $("#errorNotif").show();
}
