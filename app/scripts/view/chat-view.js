/* eslint-disable no-use-before-define */

const socket = io(NODE_URL);
let roomName;
const USER_ID = getUserId();
let urlSelectedItemId;
let chatRooms;
let currentChatRoom;
let myName;
let friendName;
let senderId;
let receiverId;
let myItems = [];
let friendItems = [];
let details = [];
$(document).ready(() => {
  initChatRoomFromUrl();
  initMessageForm();
  initRooms();
  socket.on('item-added', function (itemInfo) {
    // console.log(itemInfo);
  });
});

function initChatRoomFromUrl() {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("userId")) {
    receiverId = urlParams.get("userId");
    socketConnectRoom();
    // initUserInfo(USER_ID, receiverId);
    initInventory(USER_ID, receiverId);
    if (urlParams.has("itemId")) {
      urlSelectedItemId = urlParams.get("itemId");
    }
  }
}

function initMessageForm() {
  $('#messageForm').submit(function (e) {
    e.preventDefault(); // prevents page reloading
    var message = {
      room: roomName,
      sender: USER_ID,
      msg: $('#inputMessage').val()
    };

    socket.emit('send-msg', message);
    $('#inputMessage').val('');
    return false;
  });
  socket.on('send-msg', function (data) {
    $('#chatContent').append(renderMessage(data));
  });
}
function initRooms() {
  getChatRooms(
    getUserId(),
    (data) => {
      chatRooms = data;
      renderChatRooms();
      initUserInfo(USER_ID, receiverId);
    }
  );
}

// socket

function socketConnectRoom() { //create connect
  roomName = `${USER_ID}-${receiverId}`;
  // roomName = JSON.stringify(data);
  let roomInfo = {
    room: roomName,
    userA: `${USER_ID}`,
    userB: `${receiverId}`
  };
  socket.emit(
    "room",
    roomInfo
  );
}

// render
function renderChatRooms() {
  let chatRoomTag = $('#chatRoom');
  chatRoomTag.html('');
  chatRooms.forEach(chatRoom => {
    chatRoomTag.append(renderChatRoom(chatRoom));
  });
}
function renderChatContent() {
  console.log(currentChatRoom.messages);
  let messages = currentChatRoom.messages;
  let chatContent = $('#chatContent');

  chatContent.html('');
  messages.forEach(message => {
    chatContent.append(renderMessage(message));
  });
}

// onclick function on view
function selectChatRoom(selectedRoomName) {
  roomName = selectedRoomName;
  currentChatRoom = chatRooms.find(chatroom => chatroom.room === selectedRoomName);

  $('#chatRoom').children().removeClass('selected');
  $(`#chatRoom${selectedRoomName}`).addClass('selected');
  renderChatContent();
}



// function socketCreateRoom() {
//   let data = {
//     userId1: USER_ID,
//     userName1: myName,
//     userId2: receiverId,
//     userName2: friendName,
//     time: new Date().getTime()
//   };
//   // roomName = `${myName}-${USER_ID}-${friendName}-${receiverId}-${new Date().getTime()}`;
//   roomName = JSON.stringify(data);
  // roomInfo = {
  //   room: roomName,
  //   userA: `${USER_ID}`,
  //   userB: `${receiverId}`
  // };
//   console.log(checkRoomExist());
//   if (checkRoomExist() === undefined) {
//     socket.emit(
//       "room",
//       roomInfo
//     );
//     console.log('a' + roomName);
//   } else {

//   }
// }
// function checkRoomExist() {
//   return chatRooms.find((chatRoom) => {
//     let users = chatRoom.users;
//     return (users[0].id == USER_ID && users[1].id == receiverId)
//       || (users[1].id == USER_ID && users[0].id == receiverId);
//   });
// }
// function socketSendTradeInfo(userId, itemId, action = "add-item") {
//   let tradeInfo = {
//     'userId': userId,
//     'itemId': itemId,
//     'room': roomName
//   };
//   socket.emit(action, tradeInfo);
// }


// function initCreateView(urlParams) {
//   if (urlParams.has("userId")) {
//     receiverId = urlParams.get("userId");
//     // socketConnect();
//     // initUserInfo(USER_ID, receiverId);
//     initInventory(USER_ID, receiverId);
//     if (urlParams.has("itemId")) {
//       urlSelectedItemId = urlParams.get("itemId");
//     }
//   } else {
//     // window.location.replace("./error404.html");
//   }
//   // $("#btnRequestTradeOffer").show();
//   // $("#btnRequestTradeOffer").click(() => {
//   //   addTradeOffer(
//   //     receiverId,
//   //     details,
//   //     sendRequestSuccess,
//   //     sendRequestFails
//   //   );
//   // });
// }
// function sendRequestSuccess(data) {
//   alert("Đã gửi yêu cầu");
//   window.location.replace("/");
// }
// function sendRequestFails(err) {
//   alert("Có lỗi");
//   console.log(err);
// }
// function initUserInfo(myId, fridenId) {
//   getUser(
//     initMyUserName
//   );
//   getUserById(
//     fridenId,
//     initFriendUserName
//   )
// }
// function initMyUserName(data) {
//   myName = data.fullName;
//   initRoomName();
// }
// function initFriendUserName(data) {
//   friendName = data.fullName;
//   initRoomName();
// }
// function initRoomName() {
//   if (friendName === undefined || friendName === null) {
//     setTimeout(initRoomName, 100);
//   } else if (myName === undefined || myName === null) {
//     setTimeout(initRoomName, 100);
//   } else {
//     socketConnect();
//   }
// }

function initInventory(myId, fridenId) {
  getItemsByUserId(
    fridenId,
    ITEM_ENABLE,
    getFriendInventory,
    getFriendInventoryFalse
  );
  getItemsByUserId(
    myId,
    ITEM_ENABLE,
    getMyInventory,
    getMyInventoryFalse
  );
}

function getMyInventory(data) {
  myItems = data;
  getItemsSuccess(data, "#myInventory");
}
function getMyInventoryFalse(err) {
  getItemsFalse(err, "#myInventory");
}
function getFriendInventory(data) {
  friendItems = data;
  getItemsSuccess(data, "#friendInventory");
  if (urlSelectedItemId !== undefined) {
    selectItem(urlSelectedItemId, receiverId);
  }
}
function getFriendInventoryFalse(err) {
  getItemsFalse(err, "#friendInventory");
}
function getItemsSuccess(data, tagId) {
  const inventoryTag = $(tagId);
  inventoryTag.html("");
  if (data.length === 0) {
    inventoryTag.html("<h1>Không có đồ dùng nào.</h1>");
  }
  data.forEach(item => {
    const listItem = createTradeOfferIventoryItem(item);
    inventoryTag.append(listItem);
  });
}

function getItemsFalse(err, tagId) {
  const inventoryTag = $(tagId);
  inventoryTag.html("<h1>Không có đồ dùng nào.</h1>");
}
function show(tagId) {
  const hideTagId = tagId === "#myInventory" ? "#friendInventory" : "#myInventory";

  $(tagId).show();
  $(tagId + "Tab").addClass("selected");
  $(hideTagId).hide();
  $(hideTagId + "Tab").removeClass("selected");
}
function selectItem(itemId, userId) {
  let tradeOfferContentTag;
  const itemTag = $("#item" + itemId);
  let item;
  if (userId == USER_ID) {
    tradeOfferContentTag = $("#myTradeOffer");
    item = myItems.find((value) => value.id == itemId);
  } else {
    tradeOfferContentTag = $("#friendTradeOffer");
    item = friendItems.find((value) => value.id == itemId);
  }
  details.push({
    'itemId': item.id,
    'userId': item.user.id
  });
  socketSendTradeInfo(item.user.id, item.id, "add-item");
  itemTag.hide();
  tradeOfferContentTag.append(createTradeOfferContentItem(item, true));
}
function deselectItem(itemId, userId) {
  const itemTag = $("#item" + itemId);
  const selectItemTag = $("#selectItem" + itemId);
  itemTag.show();
  selectItemTag.remove();
  socketSendTradeInfo(userId, itemId, "remove-item");
  deleteItem = details.find(detail => detail.itemId === itemId && detail.id !== undefined);
  delete deleteItem.transactionId;
}
function renderTradeOfferContent(details, isClickable = false) {
  const myTradeOfferContentTag = $("#myTradeOffer");
  const friendTradeOfferContentTag = $("#friendTradeOffer");
  myTradeOfferContentTag.html("");
  friendTradeOfferContentTag.html("");
  details.forEach(detail => {
    if (detail.userId == USER_ID) {
      myTradeOfferContentTag.append(createTradeOfferContentItem(detail.item, isClickable));
      sendedItems.push(detail.item);
    } else {
      friendTradeOfferContentTag.append(createTradeOfferContentItem(detail.item, isClickable));
      receivedItems.push(detail.item);
    }
  });
}