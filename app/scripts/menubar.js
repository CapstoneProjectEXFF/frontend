import { toUnicode } from "punycode";

const notificationPopupTagId = 'notificationPopup';
const notificationContainerTagId = 'notificationContainer';
const relationshipNotifPopupTagId = 'relationshipNotifPopup';
const relationshipNotifContainerTagId = 'relationshipNotifContainer';

let notification = [];
let relationshipNotif = [];

// notification -----------------------------

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

function renderNotificationContainer(popupId, containerId) {
  return `
    <div class="notification__popup" id="${popupId}" style="display:none">
      <div class="notification__container" id="${containerId}"></div>
    </div>
    `;
}

function renderNotificationList(notifs) {
  const notificationContainer = $(`#${notificationContainerTagId}`);
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
  btnBell.append(
    renderNotificationContainer(
      notificationPopupTagId,
      notificationContainerTagId
    )
  );
  btnBell.click(() => {
    const notificationPopup = $(`#${notificationPopupTagId}`);
    notificationPopup.toggle();
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
// friend relationship -----------------------------

function renderRelationshipNotif(notif) {
  return `
    <div class="notification" id="relationship${notif.id}">
      <p class="notification__content">
        <a class="primary" href="/tradeoffer.html?userId=${notif.sender.id}">
          <b>${notif.sender.fullName}</b>
        </a>
        yêu cầu kết bạn
      </p>
      <div class="clearfix">
        <button class="primary--o size--mini float-right" onclick="rejectAddFriend(${notif.id})">Từ chối</button>
        <span class="float-right">&nbsp;</span>
        <button class="primary size--mini float-right" onclick="confirmAddFriend(${notif.id})">Chấp nhận</button>
      </div>
    </div>
    `;
  // <p class="notification__time">${moment(notif.modifyTime).format('DD/MM/YYYY')}</p>
}

function renderRelationshipNotifList(notifs) {
  relationshipNotif = notifs;
  const notificationContainer = $(`#${relationshipNotifContainerTagId}`);
  if (notifs.length <= 0) {
    notificationContainer.html('Không có yêu cầu kết bạn nào.');
  } else {
    notificationContainer.html('');
    notifs.forEach(notif => {
      notificationContainer.append(renderRelationshipNotif(notif));
    });
  }
}


function confirmAddFriendSuccess(data, id) {
  $(`#relationship${id}`).remove();
  relationshipNotif = relationshipNotif.filter(item => item.id !== id);
}

function confirmAddFriend(id) {
  confirmAddFriendRequest(
    id,
    confirmAddFriendSuccess
  );
}

// TODO better click
$(document).ready(() => {
  const btnFriend = $('#btnFriend');
  btnFriend.append(
    renderNotificationContainer(
      relationshipNotifPopupTagId,
      relationshipNotifContainerTagId
    )
  );
  btnFriend.click(() => {
    const relationshipNotifContainer = $(`#${relationshipNotifPopupTagId}`);
    relationshipNotifContainer.toggle();
    if (relationshipNotif.length <= 0) {
      getAddFriendRequest(
        0,
        10,
        renderRelationshipNotifList
      );
    } else {
      renderRelationshipNotifList(relationshipNotif);
    }
  });
});

// login -----------------------------
$(document).ready(() => {
  const userInforIcon = $('#userInfoIcon');
  const userInfo = getUserInfo();
  if (userInfo != null) {
    userInforIcon.html(renderUserInfo(userInfo.fullName));
  } else {
    userInforIcon.html(renderLogin());
  }
});

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

// logout -------------------------------
function logout() {
  localStorage.removeItem('EXFF_TOKEN');
  localStorage.removeItem('ID');
  localStorage.removeItem('USER_INFO');
}

// render menubar

