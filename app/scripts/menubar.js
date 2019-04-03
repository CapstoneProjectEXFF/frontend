const notificationPopupTagId = 'notificationPopup';
const notificationContainerTagId = 'notificationContainer';
const relationshipNotifPopupTagId = 'relationshipNotifPopup';
const relationshipNotifContainerTagId = 'relationshipNotifContainer';

let notification = [];
let relationshipNotif = [];

// notification -----------------------------

function renderNotification(notif) {
  let message = (notif.senderId === Number(getUserId())) ?
    `<b>${notif.receiver.fullName}</b> đề xuất một yêu trao đổi` :
    `Bạn nhận được một yêu cầu trao đổi từ <b>${notif.sender.fullName}</b>`;
  return `
    <a class="reset" href="/tradeoffer-confirm.html?id=${notif.id}">
      <div class="notification">
        <p class="notification__content">${message}</p>
        <p class="notification__time">${moment(notif.modifyTime).format('hh:mm DD/MM/YYYY')}</p>
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
function renderRelationshipNotifContainer(popupId, containerId) {
  return `
    <div class="notification__popup" id="${popupId}" style="display:none">
      <div>
        <a class="primary" href="./chat.html">Chat</a>
      </div>
      <hr>
      <div class="notification__container" id="${containerId}"></div>
    </div>
    `;
}
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
    notificationContainer.html('<p style="text-align:center;">Không có yêu cầu kết bạn nào.</p>');
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

function rejectAddFriend(id) {
  removeFriend(
    id,
    confirmAddFriendSuccess
  );
}

// TODO better click
$(document).ready(() => {
  const btnFriend = $('#btnFriend');
  btnFriend.append(
    renderRelationshipNotifContainer(
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
    userInforIcon.html(renderUserAvatar(userInfo.avatar));
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
function renderUserAvatar(avatar) {
  const image = (avatar !== null && avatar !== undefined)
    ? (avatar)
    : ('./images/no-image-icon-13.png');
  return `
    <div class="avatar">
      <div class="background" style="background-image: url(${image});"></div>
    </div>
    <span>&nbsp;</span>
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

// search form

$(document).ready(() => {
  const searchForm = $('#searchForm');
  searchForm.submit((event) => {
    event.preventDefault();
    const inputSearch = $('#inputSearch').val();
    if (/^[0-9]{1,10}$/.test(inputSearch)){
      window.location.replace(`./search.html?phone=${inputSearch}`);
    } else {
      window.location.replace(`./search.html?search=${inputSearch}`);
    }
  });
});
