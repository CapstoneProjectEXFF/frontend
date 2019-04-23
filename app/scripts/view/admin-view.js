/* eslint-disable no-alert */
/* eslint-disable new-cap */
/* eslint-disable handle-callback-err */
/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
let datatable;
let bantable;

$(document).ready(() => {
  // checkAdminLogin();
  if (isAdminLogin()) {
    $("#menu-toggle").click(function (e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
    initAdminInfo();
    initDashboard();
  } else {
    window.location.replace("./adminLogin.html");
  }
});
function initDashboard() {
  // eslint-disable-next-line new-cap
  datatable = $('#userTable').DataTable({
    "columnDefs": [
      {
        "targets": [1],
        "visible": false,
        "searchable": false
      }
    ]
  });
  bantable = $('#banTable').DataTable({
    "columnDefs": [
      {
        "targets": [1],
        "visible": false,
        "searchable": false
      }
    ]
  });
  getUsers(
    loadUserTableSuccess,
    loadUserTableError
  );
  getBanUsers(
    loadBanTableSuccess,
    loadBanTableError
  );
  $('#userTable tbody').on('click', 'tr', function () {
    let data = datatable.row(this).data();
    let url = `./inventory.html?userId=${data[1]}`;
    window.open(url, '_blank');
  });
}
function initAdminInfo() {
  let userInfor = getUserInfo();
  $('#adminName').text(userInfor.fullName);
  $('#adminIcon').html(renderUserAvatar(userInfor.avatar));
}

function loadUserTableError(err) {
  alert('Có lỗi khi tải! Vui lòng kiểm tra và tải lại trạng');
}

function loadUserTableSuccess(data) {
  const userData = data.map((user, index) => {
    return [index + 1, user.id, user.fullName, user.phoneNumber, user.address];
  });
  datatable.clear().draw();
  datatable.rows.add(userData);
  datatable.columns.adjust().draw();
}
function loadBanTableError(err) {
  alert('Có lỗi khi tải! Vui lòng kiểm tra và tải lại trạng');
}

function loadBanTableSuccess(data) {
  const userData = data.map((user, index) => {
    return [index + 1, user.id, user.fullName, user.phoneNumber, user.address];
  });
  bantable.clear().draw();
  bantable.rows.add(userData);
  bantable.columns.adjust().draw();
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

function show(tagId = 'allContainer') {
  $(".allContainer").hide();
  $("." + tagId).show();
}
