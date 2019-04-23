/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */
$(document).ready(() => {
  $("#form").submit((event) => {
    event.preventDefault();
    if (validate()) {
      let phoneNumber = $("#phoneNumber").val();
      let password = $("#password").val();
      let fullName = $("#fullname").val();
      let address = $("#address").val();
      let data = {
        "phoneNumber": phoneNumber,
        "password": password,
        "fullName": fullName,
        "address": address
      };
      register(data, registerSuccess, registerFails);
    }
  });
  $("#phoneNumber").focusout(() => {
    checkRegex('#phoneNumber', /^[0-9]{9,10}$/);
  });
  $("#password").focusout(() => {
    checkRegex('#password', /^.{8,50}$/);
  });
  $("#confirmPassword").focusout(() => {
    checkMatch('#confirmPassword', $("#password").val());
  });
  $("#fullname").focusout(() => {
    checkRequire('#fullname');
  });
  $("#address").focusout(() => {
    checkRequire('#address');
  });
});

function validate() {
  return checkRegex('#phoneNumber', /^[a-z0-9]{6,12}$/) &&
    checkRegex('#password', /^.{8,50}$/) &&
    checkMatch('#confirmPassword', $("#password").val()) &&
    checkRequire('#fullname') &&
    checkRequire('#address');
}

function registerSuccess(data) {
  window.location.replace('./login.html');
}

function registerFails(err) {
  $("#errorNotif").show();
}
