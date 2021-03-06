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
      console.log('add item');
      console.log(itemInfo);
      if (itemInfo.room === undefined || itemInfo.room !== currentChatRoom.room) {
         return;
      }
      selectItem(itemInfo.itemId, itemInfo.ownerId, false);
   });
   socket.on('item-removed', function (itemInfo) {
      console.log('remove item');
      console.log(itemInfo);
      if (itemInfo.room === undefined || itemInfo.room !== currentChatRoom.room) {
         return;
      }
      deselectItem(itemInfo.itemId, itemInfo.ownerId, false);
      if (itemInfo.removeInv != undefined && itemInfo.removeInv == 1) {
         console.log('remove item in inventory');
         removeItemFromInventory(itemInfo.itemId, itemInfo.ownerId);
      }
   });
   // socket.on('remove-from-inv', function (itemInfo) {
   //    console.log('remove inventory');
   //    console.log(itemInfo);
   //    if (itemInfo.room === undefined || itemInfo.room !== currentChatRoom.room) {
   //       return;
   //    }
   //    removeItemFromInventory(itemInfo.itemId, itemInfo.ownerId);
   // });
   // socket.on('trade-change', function (data) {
   //    console.log(data);
   //    // notification.push(data);
   //    // renderNotificationList(notification);
   //  });
   initChatBoxButton();
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
function initChatBoxButton() {
   $('#chatRoomContainer').hover(
      () => {
         if (isInventoryTabShow) {
            isInventoryTabShow = false;
            $('#chatRoomContainer').removeClass('collapse');
            $('#chatRoomContainer').addClass('expand');
            $('#chatBox').removeClass('expand');
            $('#chatBox').addClass('collapse');
         }
      },
      () => {
         if (!isInventoryTabShow) {
            isInventoryTabShow = true;
            $('#chatRoomContainer').removeClass('expand');
            $('#chatRoomContainer').addClass('collapse');
            $('#chatBox').removeClass('collapse');
            $('#chatBox').addClass('expand');
         }
      }
   );
}
function initTradeOfferButton() {
   $('#btnConfirm').click(() => {
      if (!checkTradeContentIsEmpty()) {
         $('#modalContent').append(renderModal({
            title: 'Thông báo',
            content: '<p>Bạn chưa chọn đồ dùng để trao đổi</p>'
         }));
         return;
      } else {
         $('#modalContent').append(renderModal({
            title: 'Xác nhận',
            content: '<p>Xác nhận chốt trao đổi.</p><p>Trao đổi sẽ tự động hủy chốt khi có bất kì sự thay đổi nào.</p>',
            action: [
               {
                  className: 'primary',
                  value: 'Xác nhận',
                  handle: 'confirmTradeOffer()'
               },
               {
                  className: 'danger',
                  value: 'Hủy',
                  handle: "closeModal('modal0')"
               }
            ]
         }));
      }
   });
   $('#btnReset').click(() => {
      let data = {
         room: roomName,
         userId: USER_ID
      };
      socket.emit('reset-trade', data);
      isConfirm = false;
      $('#btnConfirm').show();
      $('#tradeOfferContentNotif').html('<h4 style="margin: 0px;">Trao đổi vừa được làm mới</h4>');
      // $('#tradeOfferContentNotif').hide();
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
      $('#tradeOfferContentNotif').html('');
      $('#tradeOfferContentNotif').hide();
   });
   socket.on('user-accepted-trade', (data) => {
      console.log(data);

      if (data.room === undefined || data.room !== currentChatRoom.room) {
         return;
      }
      isConfirm = true;
      // $('#btnConfirm').hide();
      $('#tradeOfferContentNotif').html('<h4 style="margin: 0px;">Đã có một người chốt, đang đợi xác nhận</h4>');
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
      console.log("Reset");
      console.log(data);
      if (data === undefined || data.room !== currentChatRoom.room) {
         return;
      }
      $('#tradeOfferContentNotif').hide();
      selectChatRoom(currentChatRoom.room);
   });
   socket.on('trade-done', (data) => {
      console.log("Done");
      console.log(data);
      if (data.room === undefined || data.room !== currentChatRoom.room) {
         return;
      }
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
         // let name = (data.msg == USER_ID) ? USER_INFO.fullName : friendInfo.fullName;
         // $('#chatContent').append(renderNotifMessage(data, name));
         // scrollBottom(200);
      }
   });
   socket.on("trade-change", function (data) {
      if (data.room == undefined || data.room != currentChatRoom.room) {
         return;
      }
      let name = (data.receiverId == USER_ID) ? USER_INFO.fullName : friendInfo.fullName;
      let msg = renderNotifMessage(data, name);
      $('#tradeOfferContentNotif').html(`<h4 style="margin: 0px;">${msg}</h4>`);
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
         $('#loadingMax').hide();
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
      getItemsByUserIdInChatRoom(
         myId,
         ITEM_ENABLE,
         fridenId,
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
      'ownerId': userId,
      'itemId': itemId,
      'userId': USER_ID,
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
   $('#myTradeOffer').html('<h3>Chọn đồ muốn cho đi từ kho của bạn</h3>');
   $('#friendTradeOffer').html('<h3>Chọn đồ muốn cho đi từ kho bên dưới</h3>');
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
         // $('#tradeOfferContentNotif').hide();
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
               $('#tradeOfferContentNotif').html('<h4 style="margin: 0px;">Đã có một người chốt, đang đợi xác nhận</h4>');
               $('#tradeOfferContentNotif').show();
            } else {
               $('#btnConfirm').show();
               $('#btnReset').show();
               $('#btnCancle').hide();
               $('#tradeOfferContentNotif').hide();
            }
            $('#chatRoom').children().removeClass('selected');
            $(`#chatRoom${selectedRoomName}`).addClass('selected');
            $('#tradeTitle').text(`Trao đổi với ${friendInfo.fullName}`);
            $('#friendInventoryTitle').text(`${friendInfo.fullName}`);
            if (!isInventoryTabShow) {
               isInventoryTabShow = true;
               $('#chatRoomContainer').removeClass('expand');
               $('#chatRoomContainer').addClass('collapse');
               $('#chatBox').removeClass('collapse');
               $('#chatBox').addClass('expand');
            }
         } else {
            console.log('currentChatRoom do not have user');
         }
         if (currentChatRoom.status == 1) {
            isConfirm = true;
            $('#btnConfirm').hide();
            // $('#tradeOfferContentNotif').show();
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
   tradeOfferContentTag.children('h3').hide();
   if (isEmit) {
      socketSendTradeInfo(item.user.id, item.id, "add-item");
   } else {
      tradeOfferContentTag.append(createTradeOfferContentItem(item, true));
   }
}
function removeItemFromInventory(itemId, userId) {
   // if (isConfirm) {
   //    return;
   // }
   const itemTag = $("#item" + itemId);
   if (userId == USER_ID) {
      myItems = myItems.filter((value) => value.id != itemId);
   } else {
      friendItems = friendItems.filter((value) => value.id != itemId);
   }
   itemTag.remove();
}
function deselectItem(itemId, userId, isEmit = true) {
   // if (isConfirm) {
   //    return;
   // }
   const itemTag = $("#item" + itemId);
   const selectItemTag = $("#selectItem" + itemId);
   itemTag.show();
   selectItemTag.remove();
   if ($("#myTradeOffer .list__item").length <= 0) {
      $("#myTradeOffer h3").show();
   }
   if ($("#friendTradeContent .list__item").length <= 0) {
      $("#friendTradeContent h3").show();
   }
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
      inventoryTag.html("<h3>Không có đồ dùng nào.</h3>");
   }
   data.forEach(item => {
      const listItem = createTradeOfferIventoryItem(item);
      inventoryTag.append(listItem);
   });
}

function getItemsFalse(err, tagId) {
   const inventoryTag = $(tagId);
   inventoryTag.html("<h3>Không có đồ dùng nào.</h3>");
}


function checkTradeContentIsEmpty() {
   const { users } = currentChatRoom;
   return $('#myTradeOffer .list__item').length > 0 || $('#friendTradeOffer .list__item').length > 0;
}

function confirmTradeOffer() {
   closeModal('modal0');
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
   // $('#tradeOfferContentNotif').show();
}


