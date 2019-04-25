/* eslint-disable handle-callback-err */
/* eslint-disable no-alert */
/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
const USER_ID = getUserId();
let transactionId;
let senderId;
let receiverId;
let donationPostId;
let myItems = [];
let friendItems = [];
let details = [];
$(document).ready(() => {
  checkLogin();
  let urlParams = new URLSearchParams(window.location.search);
  initCreateView(urlParams);
});
function initCreateView(urlParams) {
  if (urlParams.has("donationPostId")) {
    donationPostId = urlParams.get("donationPostId");
    getInventory(USER_ID);
    getDonationInfo(donationPostId);
  } else {
    window.location.replace("./error404.html");
  }
  $("#btnRequestTradeOffer").show();
  $("#btnRequestTradeOffer").click(() => {
    addDonationTransaction(
      receiverId,
      details,
      donationPostId,
      sendRequestSuccess,
      sendRequestFails
    );
  });
}
function sendRequestSuccess(data) {
  alert("Đã gửi yêu cầu");
  window.location.replace("/");
}
function sendRequestFails(err) {
  alert("Không thể gửi yêu cầu quyên góp");
  console.log(err);
}
function getInventory(myId) {
  getItemsByUserId(
    myId,
    ITEM_ENABLE,
    getMyInventory,
    getMyInventoryFalse
  );
}
function getDonationInfo(id) {
  getDonationPost(
    id,
    (data) => {
      receiverId = data.user.id;
    }
  );
}

function getMyInventory(data) {
  myItems = data;
  getItemsSuccess(data, "#myInventory");
}
function getMyInventoryFalse(err) {
  getItemsFalse(err, "#myInventory");
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
  details = details.filter(detail => detail.itemId !== itemId);
}
function renderTradeOfferContent(details, isClickable = false) {
  const myTradeOfferContentTag = $("#myTradeOffer");
  myTradeOfferContentTag.html("");
  details.forEach(detail => {
    if (detail.userId == USER_ID) {
      myTradeOfferContentTag.append(createTradeOfferContentItem(detail.item, isClickable));
      sendedItems.push(detail.item);
    }
  });
}
