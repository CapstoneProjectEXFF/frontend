const API_URL = 'http://localhost:8080';
const DEFAULT_FUNCTION = () => { };

function getAuthentoken() {
  return localStorage.getItem('EXFF_TOKEN');
}
function getUserId() {
  return localStorage.getItem('ID');
}
function getUserInfo() {
  return JSON.parse(localStorage.getItem('USER_INFO'));
}

$(document).ready(() => {
  const userInforIcon = $('#userInfoIcon');
  const userInfo = getUserInfo();
  if (userInfo != null) {
    userInforIcon.html(renderUserInfo(userInfo.fullName));
  } else {
    userInforIcon.html(renderLogin());
  }
})

function renderLogin() {
  return `
    <a class="reset" href="./login.html">
      <i class="fas fa-user-circle"></i>
    </a>
  `;
}
function renderUserInfo(name) {
  return `
    <span style="font-size:0.8em">
      ${name}
    </span>
    <a class="reset" href="./login.html" onclick="logout()">
      <i class="fas fa-sign-out-alt"></i>
    </a>
  `;
}

//logout
function logout() {
  localStorage.removeItem("EXFF_TOKEN");
  localStorage.removeItem("ID");
  localStorage.removeItem("USER_INFO");
}