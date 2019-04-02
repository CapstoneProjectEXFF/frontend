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
  // const image = (user.avatar !== null && user.avatar !== undefined)
  //   ? (user.avatar)
  //   : ('./images/no-image-icon-13.png');
  const image = ('./images/no-image-icon-13.png');
  const msg = (chatRoom.messages !== null && chatRoom.messages.length > 0) ? chatRoom.messages[0].msg : '';
  return (
    `<div class="list__card__avatar margin--none" onclick="selectChatRoom('${chatRoom.room}')" id="chatRoom${chatRoom.room}">
      <div class="list__card__avatar__image position--relative">
        <div class="background" style="background-image: url(${image})"></div>
      </div>
      <div class="list__card__avatar__chat__info flex flex_vertical flex_justify__center">
        <h3 class="ellipsis">${chatRoom.room}</h3>
        <p class="ellipsis">${msg}</p>
      </div>
    </div>`
  );
}

function renderMessage(message) {
  let isOwner = (message.sender === getUserId());
  let messageFloat = isOwner ? 'float-right' : 'float-left';
  let messageOwner = isOwner ? 'owner' : '';
  return `
  <div class="clearfix">
    <div class="${messageFloat}">
      <p class="chat__message__owner ${messageOwner}">${message.sender}</p>
      <div class="chat__message ${messageOwner}">
        <p>${message.msg}</p>
      </div>
    </div>
  </div>
  `;
}
