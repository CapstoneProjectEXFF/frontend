const API_URL = 'http://localhost:8080';
const DEFAULT_FUNCTION = () => {};

$(document).ready(() => {
  const btnBell = $('#btnBell');
  btnBell.append(getNotificationContainer);
  btnBell.click(() => {
    const notificationContainer = $('#notificationContainer');
    notificationContainer.toggle();
  })
})

function getAuthentoken() {
  return localStorage.getItem('EXFF_TOKEN');
}
function getUserId() {
  return localStorage.getItem('ID');
}

function getNotificationContainer() {
  return `<div class="notification__container" id="notificationContainer" style="display:none"></div>`
}