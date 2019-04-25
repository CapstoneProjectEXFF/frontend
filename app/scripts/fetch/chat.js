const TRADING_URL = '/trading';
const ROOM_URL = '/room';

function getChatRooms(
  userId,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = NODE_URL + TRADING_URL + `?userId=${userId}`;
  let options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  fetchApi(
    url,
    options,
    successCallback,
    failCallback
  );
}
function getChatRoomByRoomId(
  roomId,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = NODE_URL + ROOM_URL + `?room=${roomId}`;
  let options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  fetchApi(
    url,
    options,
    successCallback,
    failCallback
  );
}

function renderChatRoom(chatRoom) {
  const user = chatRoom.users.find(u => u.userId !== getUserId());
  const image = (user.avatar !== null && user.avatar !== undefined)
    ? (user.avatar)
    : ('./images/user.png');
  const msg = (chatRoom.messages !== null && chatRoom.messages.length > 0)
    ? chatRoom.messages[chatRoom.messages.length - 1].msg
    : '';
  return (
    `<div class="list__card__avatar margin--none" onclick="selectChatRoom('${chatRoom.room}')" id="chatRoom${chatRoom.room}">
      <div class="list__card__avatar__image position--relative">
        <div class="background" style="background-image: url(${image})"></div>
      </div>
      <div class="list__card__avatar__chat__info flex flex_vertical flex_justify__center">
        <h3 class="ellipsis">${user.fullName}</h3>
        <p class="chatRoomLastMessage ellipsis">${msg}</p>
      </div>
    </div>`
  );
}

function renderMessage(message, avatar = './images/user.png') {
  let isOwner = (message.sender === getUserId());
  avatar = (avatar === undefined || avatar === null || avatar === '') ? './images/user.png' : avatar;
  let messageFloat = isOwner ? 'float-right' : 'float-left';
  // let messageAlign = isOwner ? 'flex_justify__end' : 'flex_justify__start';
  let messageOwner = isOwner ? 'owner' : '';
  let messageAvatar = isOwner
    ? ''
    : `
    <div class="chat__message__avatar">
      <div class="background" style="background-image: url(${avatar})"></div>
    </div>`;
  return `
    <div class="chat__message__container clearfix">
      ${messageAvatar}
      <div class="chat__message ${messageFloat} ${messageOwner}">
        <p>${message.msg}</p>
      </div>
    </div>
  `;
}

function renderNotifMessage(message, name = '') {
  const { type } = message;

  let msg = '';
  USER_ACCEPTED_TRADE_MESSAGE = -1;
  USER_CANCELED_TRADE_CONFIRM_MESSAGE = -2;
  USER_RESET_TRADE_MESSAGE = -3;
  TRADE_DONE_MESSAGE = -4;
  USER_ADDED_ITEM_MESSAGE = -5;
  USER_REMOVED_ITEM_MESSAGE = -6;

  switch (type) {
    case USER_ACCEPTED_TRADE_MESSAGE:
      msg = `<b>${name}</b> đã chốt`;
      break;
    case USER_CANCELED_TRADE_CONFIRM_MESSAGE:
      msg = `<b>${name}</b> vừa hủy chốt`;
      break;
    case USER_RESET_TRADE_MESSAGE:
      msg = `Cuộc trao đổi vừa bị hủy`;
      break;
    case TRADE_DONE_MESSAGE:
      msg = `Trao đổi hoàn tất`;
      break;
    case USER_ADDED_ITEM_MESSAGE:
      msg = `Một đồ dùng vừa được thêm`;
      break;
    case USER_REMOVED_ITEM_MESSAGE:
      msg = `Một đồ dùng vừa bị xóa`;
      break;
    default:
      msg = '';
      break;
  }
  return `
      <span>${msg}</span>
  `;
}
