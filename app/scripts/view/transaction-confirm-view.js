/* eslint-disable handle-callback-err */
/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
const USER_ID = getUserId();
let transactionId;
let senderId;
let receiverId;
let myUserId;
let friendUserId;
let sendedItems = []; // list item want to send
let receivedItems = []; // list item want to receive
let details = [];
let urls = [];
let removeUrls = [];
let oldImage = '';
let receiptImage;
let rate = 5;
$(document).ready(() => {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("id")) {
    initConfirmView(urlParams);
  } else {
    window.location.replace("./error404.html");
  }
});
function renderQRCode(data) {
  if (data != undefined && data != null && data != "") {
    QRCode.toCanvas(document.getElementById('canvas'), data, function (error) {
      if (error) { console.error(error); }
    });
  }
}
function initConfirmView(urlParams) {
  transactionId = urlParams.get("id");
  getTransaction(
    transactionId,
    getTransactionSuccess,
    getTransactionFail
  );
}
function initTransactionInfo(data) {
  console.log(data);
  let transaction = data.transaction;
  $('#transactionCofirmDate').text(formatTime(transaction.modifyTime));
}
function initTransactionConfirmInfo(data) {
  let transaction = data.transaction;
  $("#image").change(uploadImage);

  initReceiptConfirmButton(data);
  renderQRCode(transaction.qrCode);
  initTransactionConfirmImage(transaction);
  initRating(transaction);
  confirmReceiptSuccess(transaction);
}
function initReceiptConfirmButton(data) {
  if (isGiftAway(data.details)) {
    if (isPersonWhoGiftAway(data.details, USER_ID)) {
      // $('#uploadReceiptContainer').html('<p></p>');
      $('#confirmReceiptContainer').html('<p></p>');
      $('#btnUploadReceipt').click(() => {
        if (receiptImage != null && receiptImage != undefined && receiptImage != '') {
          uploadTransactionReceipt(
            transactionId,
            receiptImage,
            uploadReceiptSuccess,
            uploadReceiptFalse
          );
        }
      });
    } else {
      $('#uploadReceiptContainer').html('<p>Bạn là người nhận nên không thể đăng hóa đơn chuyển hàng</p>');
      $('#btnConfirmReceipt').click(() => {
        confirmTransactionReceipt(
          transactionId,
          confirmReceiptSuccess,
          confirmReceiptFalse
        );
      });
    }
  } else {
    $('#btnUploadReceipt').click(() => {
      if (receiptImage != null && receiptImage != undefined && receiptImage != '') {
        uploadTransactionReceipt(
          transactionId,
          receiptImage,
          uploadReceiptSuccess,
          uploadReceiptFalse
        );
      }
    });
    $('#btnConfirmReceipt').click(() => {
      confirmTransactionReceipt(
        transactionId,
        confirmReceiptSuccess,
        confirmReceiptFalse
      );
    });
  }
}
function initRating(data) {
  let transaction = data;
  if (transaction.status == TRANSACTION_DONE) {
    $('#btnRating').show();
  }
  $('#btnRating').click(() => {
    $('#modalRating').show();
  });
}
function initTransactionConfirmImage(data) {
  let transaction = data;
  if (transaction.status == TRANSACTION_DONE) {
    initNonActionConfirmImage(transaction);
  } else {
    initActionConfirmImage(transaction);
  }
}
function initNonActionConfirmImage(transaction) {
  $('#uploadRecieptForm').hide();

  if (USER_ID == transaction.senderId) {
    if (transaction.senderReceipt != undefined && transaction.senderReceipt != null) {
      $('#myReceipt').show();
      $('#myReceiptImage').css('background-image', `url('${transaction.senderReceipt}')`);
    }
    if (transaction.receiverReceipt != undefined && transaction.receiverReceipt != null) {
      $('#friendReceipt').show();
      $('#friendReceiptImage').css('background-image', `url('${transaction.receiverReceipt}')`);
    }
  } else if (USER_ID == transaction.receiverId) {
    if (transaction.senderReceipt != undefined && transaction.senderReceipt != null) {
      $('#friendReceipt').show();
      $('#friendReceiptImage').css('background-image', `url('${transaction.senderReceipt}')`);
    }
    if (transaction.receiverReceipt != undefined && transaction.receiverReceipt != null) {
      $('#myReceipt').show();
      $('#myReceiptImage').css('background-image', `url('${transaction.receiverReceipt}')`);
    }
  }
}
function initActionConfirmImage(transaction) {
  if (USER_ID == transaction.senderId) {
    if (transaction.senderReceipt != undefined && transaction.senderReceipt != null) {
      showImage(transaction.senderReceipt);
      $('#btnUploadReceipt').hide();
    }
    if (transaction.receiverReceipt != undefined && transaction.receiverReceipt != null) {
      $('#friendReceipt').show();
      $('#friendReceiptImage').css('background-image', `url('${transaction.receiverReceipt}')`);
      if (
        transaction.status != TRANSACTION_DONE &&
        transaction.status != TRANSACTION_RECEIVER_RECEIPT_CONFRIMED
      ) {
        $('#btnConfirmReceipt').show();
      }
    }
  } else if (USER_ID == transaction.receiverId) {
    if (transaction.senderReceipt != undefined && transaction.senderReceipt != null) {
      $('#friendReceipt').show();
      $('#friendReceiptImage').css('background-image', `url('${transaction.senderReceipt}')`);
      if (
        transaction.status != TRANSACTION_DONE &&
        transaction.status != TRANSACTION_SENDER_RECEIPT_CONFRIMED
      ) {
        $('#btnConfirmReceipt').show();
      }
    }
    if (transaction.receiverReceipt != undefined && transaction.receiverReceipt != null) {
      showImage(transaction.receiverReceipt);
      $('#btnUploadReceipt').hide();
    }
  }
}

function getTransactionSuccess(data) {
  myUserId = USER_ID;
  // console.log(data);
  $('#myName').text(getUserInfo().fullName);
  $('#myPhone').text(getUserInfo().phoneNumber);
  $('#myLink').attr('href', './inventory.html?userId=' + getUserInfo().id);
  if (getUserInfo().avatar != undefined && getUserInfo().avatar != null) {
    $('#myAvatar').css('background-image', `url('${getUserInfo().avatar}')`);
  }
  senderId = data.transaction.senderId;
  receiverId = data.transaction.receiverId;
  if (receiverId == myUserId) {
    friendUserId = senderId;
    $('#friendName').text(data.transaction.sender.fullName);
    $('#friendPhone').text(data.transaction.sender.phoneNumber);
    $('#friendLink').attr('href', './inventory.html?userId=' + data.transaction.sender.id);
    if (data.transaction.sender.avatar != undefined && data.transaction.sender.avatar != null) {
      $('#friendAvatar').css('background-image', `url('${data.transaction.sender.avatar}')`);
    }
  } else {
    friendUserId = receiverId;
    $('#friendName').text(data.transaction.receiver.fullName);
    $('#friendPhone').text(data.transaction.receiver.phoneNumber);
    $('#friendLink').attr('href', './inventory.html?userId=' + data.transaction.receiver.id);
    if (data.transaction.receiver.avatar != undefined && data.transaction.receiver.avatar != null) {
      $('#friendAvatar').css('background-image', `url('${data.transaction.receiver.avatar}')`);
    }
  }
  details = data.details;
  initTransactionInfo(data);
  initTransactionConfirmInfo(data);
  renderTradeOfferContent(details);
}
function getTransactionFail(err) {
  window.location.replace("./error404.html");
}
function renderTradeOfferContent(data, isClickable = false) {
  const myTradeOfferContentTag = $("#myTradeOffer");
  const friendTradeOfferContentTag = $("#friendTradeOffer");
  myTradeOfferContentTag.html("");
  friendTradeOfferContentTag.html("");
  data.forEach(detail => {
    if (detail.userId == USER_ID) {
      myTradeOfferContentTag.append(createTradeOfferContentItem(detail.item, isClickable));
      sendedItems.push(detail.item);
    } else {
      friendTradeOfferContentTag.append(createTradeOfferContentItem(detail.item, isClickable));
      receivedItems.push(detail.item);
    }
  });
}

function renderStar(ratingNum) {
  const tag = $('#ratingStar');
  let res = '';
  rate = ratingNum + 1;
  for (let index = 0; index < 5; index++) {
    if (index <= ratingNum) {
      res += `<i class="fas fa-star" onclick="renderStar(${index})"></i>`;
    } else {
      res += `<i class="far fa-star" onclick="renderStar(${index})"></i>`;
    }
  }
  tag.html(res);
}

function sendRate() {
  const content = $('#content').val();
  rating(
    friendUserId,
    content,
    rate,
    hideModal('modalRating')
  );
}

function uploadReceiptSuccess(data) {
  console.log(data);
  const btnUpload = $('#btnUploadReceipt');
  removeUrls.forEach(url => {
    deleteUploadedImageOnFirebase(url);
  });
  removeUrls = [];
  btnUpload.hide();
}

function uploadReceiptFalse(error) {
  console.log(error);

  $('#modalContent').html(renderModal({
    title: 'Thông báo',
    content: '<p>Tải ảnh lên có vấn đề, xin vui lòng tải lại.</p>'
  }));
}

function confirmReceiptSuccess(data) {
  console.log('success');
  console.log(data);
  let transaction = data;
  if (transaction.status == TRANSACTION_DONE) {
    $('#receiptConfirmNotif').text('Trao đổi đã được xác nhận thành công');
    $('#receiptConfirmNotif').show();
    $('#btnRating').show();
    $('#btnConfirmReceipt').hide();
  } else if (transaction.status == TRANSACTION_SENDER_RECEIPT_CONFRIMED) {
    if (USER_ID == transaction.senderId) {
      $('#receiptConfirmNotif').text('Người dùng đã xác nhận đơn của bạn');
      $('#receiptConfirmNotif').show();
    }
    if (USER_ID == transaction.receiverId) {
      $('#receiptConfirmNotif').text('Bạn xác nhận đơn chuyển hàng');
      $('#receiptConfirmNotif').show();
      $('#btnConfirmReceipt').hide();
    }
  } else if (transaction.status == TRANSACTION_RECEIVER_RECEIPT_CONFRIMED) {
    if (USER_ID == transaction.senderId) {
      $('#receiptConfirmNotif').text('Bạn đã xác nhận chuyển hàng');
      $('#receiptConfirmNotif').show();
      $('#btnConfirmReceipt').hide();
    }
    if (USER_ID == transaction.receiverId) {
      $('#receiptConfirmNotif').text('Người dùng đã xác nhận đơn của bạn');
      $('#receiptConfirmNotif').show();
    }
  }
  if (transaction.senderReceipt == null && transaction.receiverReceipt == null) {
    show('qrContainer');
  } else {
    show('receiptContainer');
  }
}

function confirmReceiptFalse(error) {
  console.log(error);

  $('#modalContent').html(renderModal({
    title: 'Thông báo',
    content: '<p>Quá trình xác nhận có vấn đề, vui lòng thử lại.</p>'
  }));
}





function uploadImage(event) {
  const files = event.target.files;
  const imageUploaded = $('#imageUploaded');
  if (files == undefined || files[0] == 0) {
    return;
  }
  uploadImageToFirebase(files[0], showImage);
}
function showImage(url) {
  const imageUploaded = $('#imageUploaded');
  const btnChooseFile = $('#btnChooseFile');
  const btnUpload = $('#btnUploadReceipt');
  if (oldImage == undefined || oldImage == '') {
    oldImage = url;
  } else {
    removeUrls.push(oldImage);
    oldImage = url;
  }
  receiptImage = url;
  imageUploaded.html(renderInputImage(url, urls.indexOf(url)));
  btnChooseFile.hide();
  btnUpload.show();
}
function deleteImage(url, id) {
  const btnChooseFile = $('#btnChooseFile');
  const btnUpload = $('#btnUploadReceipt');
  $(`#image${id}`).remove();
  removeUrls.push(oldImage);
  oldImage = '';
  if (url == receiptImage) {
    receiptImage = '';
  }
  btnChooseFile.show();
  btnUpload.hide();
}

function show(tagId = 'allContainer') {
  $(".tab").removeClass("selected");
  $(".allContainer").hide();
  $('#' + tagId + "Tab").addClass("selected");
  $("." + tagId).show();
}

function isPersonWhoGiftAway(data, userId) {
  let res = true;
  data.forEach(detail => {
    if (detail.item.user.id + '' != userId) {
      res = false;
    }
  });
  return res;
}

function isGiftAway(data) {
  for (let index = 1; index < data.length; index++) {
    const detail1 = data[index - 1];
    const detail2 = data[index];
    if (detail1.item.user.id != detail2.item.user.id) {
      return false;
    }
  }
  return true;
}
