const notificationPopupTagId = 'notificationPopup';
const notificationContainerTagId = 'notificationContainer';
const relationshipNotifPopupTagId = 'relationshipNotifPopup';
const relationshipNotifContainerTagId = 'relationshipNotifContainer';
const chatNotifPopupTagId = 'chatNotifPopup';
const chatNotifContainerTagId = 'chatNotifContainer';

let notification = [];
let relationshipNotif = [];
let chatNotif = [];

// hide menu popup

function hideAllMenuPopupExcept(tagId) {
  $('.popup').not(`#${tagId}`).hide();
}

// notification -----------------------------

function renderNotification(notif) {
  let message = (notif.senderId === Number(getUserId())) ?
    `<b>${notif.receiver.fullName}</b> đề xuất một yêu trao đổi` :
    `Bạn nhận được một yêu cầu trao đổi từ <b>${notif.sender.fullName}</b>`;
  return `
    <a class="reset" href="/chat.html?userId=${notif.sender.id}">
      <div class="notification">
        <p class="notification__content">${message}</p>
        <p class="notification__time">${formatTime(notif.modifyTime)}</p>
      </div>
    </a>
  `;
}

function renderNotificationContainer(popupId, containerId) {
  return `
    <div class="popup notification__popup " id="${popupId}" style="display:none">
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
  btnBell.hide();
  // btnBell.append(
  //   renderNotificationContainer(
  //     notificationPopupTagId,
  //     notificationContainerTagId
  //   )
  // );
  // btnBell.click(() => {
  //   const notificationPopup = $(`#${notificationPopupTagId}`);
  //   hideAllMenuPopupExcept(notificationPopupTagId);
  //   notificationPopup.toggle();
  //   if (notification.length <= 0) {
  //     getReceivedTransaction((data) => {
  //       notification = data;
  //       renderNotificationList(notification);
  //     });
  //   } else {
  //     renderNotificationList(notification);
  //   }
  // });
});

// friend relationship -----------------------------
function renderRelationshipNotifContainer(popupId, containerId) {
  return `
    <div class="popup notification__popup " id="${popupId}" style="display:none">
      <div class="notification__container" id="${containerId}"></div>
    </div>
    `;
}
function renderRelationshipNotif(notif) {
  return `
    <div class="notification" id="relationship${notif.id}">
      <p class="notification__content">
        <a class="primary" href="/inventory.html?userId=${notif.sender.id}">
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

function confirmAddFriend(notifId) {
  confirmAddFriendRequest(
    notifId,
    (data, id) => {
      confirmAddFriendSuccess(data, id);
      initCancleAddFriendButton({ id: id });
    }
  );
}

function rejectAddFriend(id) {
  removeFriend(
    id,
    (data) => {
      initFriendButton();
    }
  );
}

// TODO better click
$(document).ready(() => {
  const btnFriend = $('#btnFriend');
  if (isNotLogin()) {
    btnFriend.hide();
  } else {
    btnFriend.append(
      renderRelationshipNotifContainer(
        relationshipNotifPopupTagId,
        relationshipNotifContainerTagId
      )
    );
    btnFriend.click(() => {
      const relationshipNotifContainer = $(`#${relationshipNotifPopupTagId}`);
      hideAllMenuPopupExcept(relationshipNotifPopupTagId);
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
  }
});

// chat ------------------------------

function renderChatNotifContainer(popupId, containerId) {
  return `
    <div class="popup notification__popup " id="${popupId}" style="display:none">
      <a class="primary" href="./chat.html">
        <div>
          Chat
        </div>
      </a>
      <hr class="gray no--margin"/>
      <div class="notification__container" id="${containerId}"></div>
    </div>
    `;
}
function renderChatNotif(chatRoom) {
  const user = chatRoom.users.find(u => u.userId !== getUserId());
  const image = (user.avatar !== null && user.avatar !== undefined)
    ? (user.avatar)
    : ('./images/user.png');
  const msg = (chatRoom.messages !== null && chatRoom.messages.length > 0)
    ? chatRoom.messages[chatRoom.messages.length - 1].msg
    : '';
  return (
    `<a class="reset" href='./chat.html?userId=${user.userId}'>
      <div class="list__card__avatar margin--none" id="chatRoom${chatRoom.room}">
        <div class="list__card__avatar__image position--relative">
          <div class="background" style="background-image: url(${image})"></div>
        </div>
        <div class="list__card__avatar__chat__info flex flex_vertical flex_justify__center">
          <h3 class="ellipsis">${user.fullName}</h3>
          <p class="chatRoomLastMessage ellipsis">${msg}</p>
        </div>
        <hr class="gray no--margin"/>
      </div>
    </a>`
  );
  // <p class="notification__time">${moment(notif.modifyTime).format('DD/MM/YYYY')}</p>
}
function renderChatNotifList(notifs) {
  chatNotif = notifs;
  const notificationContainer = $(`#${chatNotifContainerTagId}`);
  if (notifs.length <= 0) {
    notificationContainer.html('<p style="text-align:center;">Không có cuộc trò chuyện nào.</p>');
  } else {
    notificationContainer.html('');
    notifs.forEach(notif => {
      notificationContainer.append(renderChatNotif(notif));
    });
  }
}

$(document).ready(() => {
  const btnChatNotif = $('#btnChat');
  if (isNotLogin()) {
    btnChatNotif.hide();
  } else {
    btnChatNotif.append(
      renderChatNotifContainer(
        chatNotifPopupTagId,
        chatNotifContainerTagId
      )
    );
    btnChatNotif.click(() => {
      const chatNotifContainer = $(`#${chatNotifPopupTagId}`);
      hideAllMenuPopupExcept(chatNotifPopupTagId);
      chatNotifContainer.toggle();
      if (chatNotif.length <= 0) {
        getChatRooms(
          getUserId(),
          renderChatNotifList
        );
      } else {
        renderChatNotifList(chatNotif);
      }
    });
  }
});


// login -----------------------------
$(document).ready(() => {
  const userInforIcon = $('#userInfoIcon');
  const userInfo = getUserInfo();
  if (userInfo != null) {
    userInforIcon.html(renderUserAvatar(userInfo.avatar));
    userInforIcon.click(() => {
      const userPopup = $('#userPopup');
      hideAllMenuPopupExcept('userPopup');
      userPopup.toggle();
    });
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
    : ('./images/user.png');
  return `
    <div class="avatar">
      <div class="background" id="menubarAvatar" style="background-image: url(${image});"></div>
    </div>
    <div class="popup user__popup" id="userPopup" style="display:none">
      <a class="reset" href="./form-item.html">
        <p>
          <i class="fas fa-plus"></i> Thêm đồ
        </p>
      </a>
      <a class="reset" href="./form-donation-post.html">
        <p>
          <i class="fas fa-pen"></i> Viết bài
        </p>
      </a>
      <a class="reset" href="./inventory.html">
        <p>
          <i class="fas fa-user"></i> Tài khoản
        </p>
      </a>
      <a class="reset" href="./profile.html">
        <p>
        <i class="fas fa-edit"></i> Sửa thông tin
        </p>
      </a>
      <hr style="margin:0;"/>
      <a class="reset" href="./login.html" onclick="logout()">
        <p>
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </p>
      </a>
    </div>
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
    if (/^[0-9]{1,10}$/.test(inputSearch)) {
      window.location.replace(`./search.html?phone=${inputSearch}`);
    } else {
      window.location.replace(`./search.html?search=${inputSearch}`);
    }
  });
});
