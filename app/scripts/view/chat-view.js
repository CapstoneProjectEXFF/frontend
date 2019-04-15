/* eslint-disable handle-callback-err */
/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */

const socket = io(NODE_URL);
const USER_ID = getUserId();
const USER_INFO = getUserInfo();

let roomName;
let urlSelectedItemId;
let chatRooms;
let currentChatRoom;
let myInfo;
let friendInfo;
let senderId;
let receiverId;
let myItems = [];
let friendItems = [];
let details = [];

let isInventoryTabShow = false;
let isConfirm = false;

$(document).ready(() => {
   checkLogin();
   let urlParams = new URLSearchParams(window.location.search);
   if (urlParams.has("userId")) {
      initChatRoomFromUrl();
   } else {
      initRooms();
   }
   initMessageForm();
   socket.on('item-added', function (itemInfo) {
      console.log(itemInfo);
      selectItem(itemInfo.itemId, itemInfo.userId, false);
   });
   socket.on('item-removed', function (itemInfo) {
      console.log(itemInfo);
      deselectItem(itemInfo.itemId, itemInfo.userId, false);
   });
   initInventoryButton();
   initTradeOfferButton();
   // initDateTime();
   // getTransactionHistory(
   //    initTransactionHistory
   // );
});
function initTransactionHistory(data) {
   const transactionHistoryTag = $('#transactionHistory');
   data.forEach(transaction => {
      transactionHistoryTag.append(
         renderTransactionHistory(transaction)
      );
   });
}
function initInventoryButton() {
   $('#chatInventoryTab').click(() => {
      if (!isInventoryTabShow) {
         isInventoryTabShow = true;
         $('#chatRoomContainer').removeClass('expand');
         $('#chatRoomContainer').addClass('collapse');
         $('#chatInventory').removeClass('collapse');
         $('#chatInventory').addClass('expand');
      } else {
         isInventoryTabShow = false;
         $('#chatRoomContainer').removeClass('collapse');
         $('#chatRoomContainer').addClass('expand');
         $('#chatInventory').removeClass('expand');
         $('#chatInventory').addClass('collapse');
      }
   });
}
function initTradeOfferButton() {
   $('#btnConfirm').click(() => {
      if (!checkTradeContentIsEmpty()) {
         return;
      }
      let data = {
         room: roomName,
         userId: USER_ID,
         token: getAuthentoken()
      };
      socket.emit('confirm-trade', data);
      isConfirm = true;
      $('#btnConfirm').hide();
      $('#btnReset').hide();
      $('#btnCancle').show();
      $('#tradeOfferContentNotif').show();
   });
   $('#btnReset').click(() => {
      let data = {
         room: roomName,
         userId: USER_ID
      };
      socket.emit('reset-trade', data);
      isConfirm = false;
      $('#btnConfirm').show();
      $('#tradeOfferContentNotif').hide();
   });
   $('#btnCancle').click(() => {
      let data = {
         room: roomName,
         userId: USER_ID
      };
      socket.emit('unconfirm-trade', data);
      isConfirm = false;
      $('#btnConfirm').show();
      $('#btnReset').show();
      $('#btnCancle').hide();
      $('#tradeOfferContentNotif').hide();
   });
   socket.on('user-accepted-trade', (data) => {
      console.log(data);

      if (data.room === undefined || data.room !== currentChatRoom.room) {
         return;
      }
      isConfirm = true;
      // $('#btnConfirm').hide();
      $('#tradeOfferContentNotif').show();
   });
   socket.on('trade-unconfirmed', (data) => {
      console.log('unconfirm');
      console.log(data);

      if (data.room === undefined || data.room !== currentChatRoom.room) {
         return;
      }
      $('#btnConfirm').show();
      $('#btnReset').show();
      $('#btnCancle').hide();
      $('#tradeOfferContentNotif').hide();
      // selectChatRoom(currentChatRoom.room);
   });
   socket.on('trade-reseted', (data) => {
      console.log("Reset: " + data);

      if (data === undefined || data !== currentChatRoom.room) {
         return;
      }
      selectChatRoom(currentChatRoom.room);
   });
   socket.on('trade-done', (data) => {
      console.log("Done" + data);
      if (data.room === undefined || data.room !== currentChatRoom.room) {
         // selectChatRoom(currentChatRoom.room);
         return;
      }
      // selectChatRoom(currentChatRoom.room);
      window.location.replace(`./transaction-confirm.html?id=${data.transactionId}`);
   });
}

// function initDateTime() {
//    // library jquery datetime picker https://xdsoft.net/jqplugins/datetimepicker/
//    $('#datetimepicker').datetimepicker({
//       format: 'd/m/Y, H:i'
//    });
//    $('#datetimepicker').val(moment().format('DD/MM/YYYY, hh:mm'));
// }

function initChatRoomFromUrl() {
   let urlParams = new URLSearchParams(window.location.search);
   if (urlParams.has("userId")) {
      receiverId = urlParams.get("userId");
      socketConnectRoom();
      if (urlParams.has("itemId")) {
         urlSelectedItemId = urlParams.get("itemId");
      }
   }
}

function initMessageForm() {
   $('#messageForm').submit(function (e) {
      e.preventDefault();
      let msg = $('#inputMessage').val();
      if (msg.length !== 0) {
         let message = {
            room: roomName,
            sender: USER_ID,
            msg: msg
         };
         socket.emit('send-msg', message);
         $('#inputMessage').val('');
      }
      return false;
   });
   socket.on('send-msg', function (data) {
      if (data.room == undefined || data.room != currentChatRoom.room) {
         return;
      }
      if (data.sender > 0) {
         let avatar = (data.sender === USER_ID) ? USER_INFO.avatar : friendInfo.avatar;
         $(`#chatRoom${currentChatRoom.room} .chatRoomLastMessage`).text(data.msg);
         $('#chatContent').append(renderMessage(data, avatar));
         scrollBottom(200);
      } else {
         let name = (data.msg == USER_ID) ? USER_INFO.fullName : friendInfo.fullName;
         $('#chatContent').append(renderNotifMessage(data, name));
         scrollBottom(200);
      }
   });
}
function initRooms() {
   getChatRooms(
      USER_ID,
      (data) => {
         chatRooms = data.sort(function (a, b) {
            let aTime = new Date(a.activeTime);
            let bTime = new Date(b.activeTime);
            return aTime > bTime ? -1 : aTime < bTime ? 1 : 0;
         });
         renderChatRooms();
         if (chatRooms.length > 0) {
            selectChatRoom(chatRooms[0].room);
         }
      }
   );
}

function initInventory(myId, fridenId) {
   let p1 = new Promise((resolve, reject) => {
      getItemsByUserId(
         fridenId,
         ITEM_ENABLE,
         (data) => {
            getFriendInventory(data);
            resolve(true);
         },
         getFriendInventoryFalse
      );
   });
   let p2 = new Promise((resolve, reject) => {
      getItemsByUserId(
         myId,
         ITEM_ENABLE,
         (data) => {
            getMyInventory(data);
            resolve(true);
         },
         getMyInventoryFalse
      );
   });
   Promise.all([p1, p2]).then((value) => {
      initTradeOfferContent();
   });
}

function initTradeOfferContent() {
   renderTradeOfferContent(currentChatRoom.users);
   if (urlSelectedItemId !== undefined) {
      let tmpUser = currentChatRoom.users.find(user => user.userId == receiverId);
      let tmpItemId = tmpUser.item.find(itemId => urlSelectedItemId == itemId);
      if (tmpItemId == undefined) {
         selectItem(urlSelectedItemId, receiverId);
         urlSelectedItemId = undefined;
      }
   }
}

// socket

function socketConnectRoom() { //create connect
   roomName = `${USER_ID}-${receiverId}`;
   // roomName = JSON.stringify(data);
   let roomInfo = {
      room: roomName
   };
   socket.emit(
      "get-room",
      roomInfo
   );
   socket.on('room-ready', initRooms);
}

function socketSendTradeInfo(userId, itemId, action = "add-item") {
   let tradeInfo = {
      'userId': userId,
      'itemId': itemId,
      'room': roomName
   };
   socket.emit(action, tradeInfo);
}

// render

function show(tagId) {
   const hideTagId = tagId === "#myInventory" ? "#friendInventory" : "#myInventory";
   $(tagId).show();
   $(tagId + "Tab").addClass("selected");
   $(hideTagId).hide();
   $(hideTagId + "Tab").removeClass("selected");
}

function scrollBottom(time = 0) {
   $('#chatContent').animate({
      scrollTop: $('#chatContent').get(0).scrollHeight
   }, time);
}

function renderChatRooms() {
   let chatRoomTag = $('#chatRoom');
   chatRoomTag.html('');
   chatRooms.forEach(chatRoom => {
      chatRoomTag.append(renderChatRoom(chatRoom));
   });
}
function renderChatContent() {
   let messages = currentChatRoom.messages;
   let chatContent = $('#chatContent');

   chatContent.html('');
   messages.forEach(message => {
      let avatar = (message.sender === USER_ID) ? USER_INFO.avatar : friendInfo.avatar;
      chatContent.append(renderMessage(message, avatar));
   });
   scrollBottom();
}

function renderTradeOfferContent(users, isClickable = true) {
   $('#myTradeOffer').html('');
   $('#friendTradeOffer').html('');
   users.forEach(user => {
      user.item.forEach(itemId => {
         selectItem(itemId, user.userId, false);
      });
   });
}

// onclick function on view
function selectChatRoom(selectedRoomName) {
   roomName = selectedRoomName;
   getChatRoomByRoomId(
      roomName,
      (data) => {
         currentChatRoom = data;
         let roomInfo = {
            room: roomName
         };
         socket.emit(
            "rejoin-room",
            roomInfo
         );
         $('#tradeOfferContentNotif').hide();
         if (currentChatRoom.users != undefined && currentChatRoom.users.length >= 2) {
            myInfo = (currentChatRoom.users[0].userId === USER_ID) ? currentChatRoom.users[0] : currentChatRoom.users[1];
            friendInfo = (currentChatRoom.users[0].userId !== USER_ID) ? currentChatRoom.users[0] : currentChatRoom.users[1];
            receiverId = friendInfo.userId;
            initInventory(USER_ID, receiverId);
            renderChatContent();
            if (myInfo.status == 1) {
               $('#btnConfirm').hide();
               $('#btnReset').hide();
               $('#btnCancle').show();
               $('#tradeOfferContentNotif').show();
            } else {
               $('#btnConfirm').show();
               $('#btnReset').show();
               $('#btnCancle').hide();
               $('#tradeOfferContentNotif').hide();
            }
            $('#chatRoom').children().removeClass('selected');
            $(`#chatRoom${selectedRoomName}`).addClass('selected');
            if (!isInventoryTabShow) {
               $('#chatInventoryTab').click();
            }
         } else {
            console.log('currentChatRoom do not have user');
         }
         if (currentChatRoom.status == 1) {
            isConfirm = true;
            $('#btnConfirm').hide();
            $('#tradeOfferContentNotif').show();
         }
      }
   );
}
function selectItem(itemId, userId, isEmit = true) {
   // if (isConfirm) {
   //    return;
   // }
   const itemTag = $("#item" + itemId);
   let tradeOfferContentTag;
   let item;
   if (userId == USER_ID) {
      tradeOfferContentTag = $("#myTradeOffer");
      item = myItems.find((value) => value.id == itemId);
   } else {
      tradeOfferContentTag = $("#friendTradeOffer");
      item = friendItems.find((value) => value.id == itemId);
   }
   itemTag.hide();
   if (isEmit) {
      socketSendTradeInfo(item.user.id, item.id, "add-item");
   } else {
      tradeOfferContentTag.append(createTradeOfferContentItem(item, true));
   }
}
function deselectItem(itemId, userId, isEmit = true) {
   // if (isConfirm) {
   //    return;
   // }
   const itemTag = $("#item" + itemId);
   const selectItemTag = $("#selectItem" + itemId);
   itemTag.show();
   selectItemTag.remove();
   if (isEmit) {
      socketSendTradeInfo(userId, itemId, "remove-item");
   }
}

// callback
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


function checkTradeContentIsEmpty() {
   const { users } = currentChatRoom;
   return $('#myTradeOffer .list__item').length > 0 || $('#friendTradeOffer .list__item').length > 0;
}



