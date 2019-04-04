/* eslint-disable handle-callback-err */
/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */

const socket = io(NODE_URL);
const USER_ID = getUserId();

let roomName;
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
   let urlParams = new URLSearchParams(window.location.search);
   if (urlParams.has("userId")) {
      initChatRoomFromUrl();
   } else {
      initRooms();
   }
   initMessageForm();
   socket.on('item-added', function (itemInfo) {
      // console.log(itemInfo);
   });
   initDateTime();
   initTradeOfferButton();
});

function initTradeOfferButton() {
   $('#btnConfirm').click(() => {
      let data = {
         room: roomName,
         userId: USER_ID,
         token: getAuthentoken()
      };
      console.log('hello');
      socket.emit('confirm-trade', data);
   });
   $('#btnCancle').click(() => {
      let data = {
         room: roomName
      };
      socket.emit('cancel-trade', data);
   });
}

function initDateTime() {
   // library jquery datetime picker https://xdsoft.net/jqplugins/datetimepicker/
   $('#datetimepicker').datetimepicker({
      format: 'd/m/Y, H:i'
   });
   $('#datetimepicker').val(moment().format('DD/MM/YYYY, hh:mm'));
}

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
      e.preventDefault(); // prevents page reloading
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
      $('#chatContent').append(renderMessage(data));
      scrollBottom(200);
   });
}
function initRooms() {
   getChatRooms(
      getUserId(),
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
   Promise.all([p1, p2]).then((value) => initTradeOfferContent());
}

function initTradeOfferContent() {
   console.log(myItems);
   console.log(friendItems);
   renderTradeOfferContent(currentChatRoom.users);
   if (urlSelectedItemId !== undefined) {
      let tmpUser = currentChatRoom.users.find(user => user.userId == receiverId);
      let tmpItemId = tmpUser.item.find(itemId => urlSelectedItemId == itemId);
      if (tmpItemId == undefined) {
         selectItem(urlSelectedItemId, receiverId);
      }
   }
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
      chatContent.append(renderMessage(message));
   });
   scrollBottom();
}

function renderTradeOfferContent(users, isClickable = true) {
   users.forEach(user => {
      user.item.forEach(itemId => {
         selectItem(itemId, user.userId);
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
         if (currentChatRoom.users != undefined && currentChatRoom.users.length >= 2) {
            receiverId = (currentChatRoom.users[0].userId !== USER_ID)
               ? currentChatRoom.users[0].userId
               : currentChatRoom.users[1].userId;
            $('#chatRoom').children().removeClass('selected');
            $(`#chatRoom${selectedRoomName}`).addClass('selected');
            initInventory(USER_ID, receiverId);
            renderChatContent();
         } else {
            console.log('currentChatRoom do not have user');
         }
      }
   );
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






