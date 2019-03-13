let notification = [];

function renderNotification(notif) {
  return `
    <a class="reset" href="/tradeoffer.html?id=${notif.id}">
      <div class="notification">
        <p class="notification__content">Bạn nhận được một yêu cầu trao đổi từ <b>${notif.sender.fullName}</b></p>
        <p class="notification__time">${moment(notif.modifyTime).format('DD/MM/YYYY')}</p>
      </div>
    </a>
  `;
}

function renderNotificationContainer() {
  return `
    <div class="notification__popup" id="notificationPopup" style="display:none">
      <div class="notification__container" id="notificationContainer"></div>
    </div>
    `;
}

function renderNotificationList(notifs) {
  const notificationContainer = $('#notificationContainer');
  if (notifs.length <= 0) {
    notificationContainer.html('Không có giao dịch nào.');
  } else {
    notificationContainer.html('');
    notifs.forEach(notif => {
      notificationContainer.append(renderNotification(notif));
    });
  }
}

$(document).ready(() => {
  const btnBell = $('#btnBell');
  btnBell.append(renderNotificationContainer);
  btnBell.click(() => {
    const notificationContainer = $('#notificationPopup');
    notificationContainer.toggle();
    if (notification.length <= 0) {
      getReceivedTransaction((data) => {
        notification = data;
        renderNotificationList(notification);
      });
    } else {
      renderNotificationList(notification);
    }
  });
});
