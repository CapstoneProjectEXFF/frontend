/* eslint-disable no-alert */
/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */
const USER_ID = getUserId();
let urlSelectedItemId;
let transactionId;
let senderId;
let receiverId;
let myItems = [];
let friendItems = [];
let details = [];
$(document).ready(() => {
  let urlParams = new URLSearchParams(window.location.search);
  initCreateView(urlParams);
});
function initCreateView(urlParams) {
  if (urlParams.has("userId")) {
    receiverId = urlParams.get("userId");
    getInventory(USER_ID, receiverId);
  } else {
    window.location.replace("./error404.html");
  }
  if (urlParams.has("itemId")) {
    urlSelectedItemId = urlParams.get("itemId");
  }
  $("#btnRequestTradeOffer").show();
  $("#btnRequestTradeOffer").click(() => {
    addTradeOffer(
      receiverId,
      details,
      sendRequestSuccess,
      sendRequestFails
    );
  });
}
function sendRequestSuccess(data) {
  // alert("Đã gửi yêu cầu");
  window.location.replace("./index.html");
}
function sendRequestFails(err) {
  // alert("Có lỗi");
  console.log(err);
}
function getInventory(myId, fridenId) {
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
  itemTag.hide();
  tradeOfferContentTag.append(createTradeOfferContentItem(item, true));
}
function deselectItem(itemId, userId) {
  const itemTag = $("#item" + itemId);
  const selectItemTag = $("#selectItem" + itemId);
  itemTag.show();
  selectItemTag.remove();
  if (userId == USER_ID) {
    sendedItems = sendedItems.filter(item => item.id != itemId);
  } else {
    receivedItems = receivedItems.filter(item => item.id != itemId);
  }
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
