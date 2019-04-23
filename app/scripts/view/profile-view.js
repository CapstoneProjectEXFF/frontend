/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */
$(document).ready(() => {
  getUser(
    initForm
  );
  $("#formInfor").submit((event) => {
    event.preventDefault();
    if (checkRequire('#fullname') && checkRequire('#address')) {
      let avatar = $("#avatar").val();
      let fullName = $("#fullname").val();
      let address = $("#address").val();
      let data = {
        "avatar": avatar,
        "fullName": fullName,
        "address": address
      };
      updateUser(data, updateSuccess, updateFails);
    }
  });
  $("#formPassword").submit((event) => {
    event.preventDefault();
    if (validatePasswordForm()) {
      let oldPassword = $("#oldPassword").val();
      let password = $("#password").val();
      let data = {
        "oldPassword": oldPassword,
        "newPassword": password
      };
      updateUserPasword(data, updatePasswordSuccess, updatePasswordFails);
    }
  });
  $("#oldPassword").focusout(() => {
    checkRegex('#oldPassword', /^.{8,50}$/);
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
  $("#image").change(uploadImage);
});
function initForm(user) {
  $("#phoneNumber").val(user.phoneNumber);
  $("#avatar").val(user.avatar);
  $("#fullname").val(user.fullName);
  $("#address").val(user.address);
  $("#imageUploaded").attr('src', user.avatar);
}
function validatePasswordForm() {
  return checkRegex('#oldPassword', /^.{8,50}$/) &&
    checkRegex('#password', /^.{8,50}$/) &&
    checkMatch('#confirmPassword', $("#password").val());
}
function updateSuccess(data) {
  localStorage.setItem('USER_INFO', JSON.stringify(data.User));
  const avatar = data.User.avatar;
  const image = (avatar !== null && avatar !== undefined)
    ? (avatar)
    : ('./images/user.png');
  $("#menubarAvatar").css("background-image", `url(${image})`);
  $("#successNotif").show();
  $("#errorNotif").hide();
}

function updateFails(err) {
  $("#errorNotif").show();
  $("#successNotif").hide();
}
function updatePasswordSuccess(data) {
  $("#successPasswordNotif").show();
  $("#errorPasswordNotif").hide();
  localStorage.removeItem('EXFF_TOKEN');
  localStorage.removeItem('ID');
  localStorage.removeItem('USER_INFO');
  window.location.replace('./login.html');
}

function updatePasswordFails(err) {
  $("#errorPasswordNotif").show();
  $("#successPasswordNotif").hide();
}
function uploadImage(event) {
  const file = event.target.files[0];
  uploadImageToFirebase(file, showImage);
}
function showImage(url) {
  $("#avatar").val(url);
  $("#imageUploaded").attr('src', url);
}
