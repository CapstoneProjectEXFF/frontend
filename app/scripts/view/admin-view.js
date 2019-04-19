/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
$(document).ready(() => {
  checkAdminLogin();
  $("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });
  initAdminInfo();
});
function initAdminInfo() {
  let userInfor = getUserInfo();
  $('#adminName').text(userInfor.fullName);
  $('#adminIcon').html(renderUserAvatar(userInfor.avatar));
}
function checkAdminLogin() {
  if (getUserId() === undefined || getUserId() === null || getAuthentoken() === null) {
    window.location.replace("./adminLogin.html");
  } else {
    let userInfor = getUserInfo();
    if (userInfor.roleByRoleId.name != 'ADMIN') {
      window.location.replace("./adminLogin.html");
    }
  }
}

function renderUserAvatar(avatar) {
  const image = (avatar !== null && avatar !== undefined)
    ? (avatar)
    : ('./images/user.png');
  return `
    <div class="admin__avatar position--relative">
      <div class="background" style="background-image: url(${image});"></div>
    </div>
  `;
}

