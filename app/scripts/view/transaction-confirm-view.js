/* eslint-disable handle-callback-err */
/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
const USER_ID = getUserId();
let transactionId;
let senderId;
let receiverId;
let myUserId;
let friendUserId;
let myUserInfo;
let friendUserInfo;
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
  let info = `
      <div class="float-left">
        <p class="ellipsis">${transaction.sender.fullName}</p>
        <p class="ellipsis">${transaction.sender.phoneNumber}</p>
      </div>
      <div class="split"></div>
      <div class="float-right">
        <p class="ellipsis">${transaction.receiver.fullName}</p>
        <p class="ellipsis">${transaction.receiver.phoneNumber}</p>
      </div>
      `;
  $('#transactionUserInfo').html(info);
  $('#transactionCofirmDate').text(formatTime(transaction.modifyTime));
}
function initTransactionConfirmInfo(data) {
  let transaction = data.transaction;
  $("#image").change(uploadImage);
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
  renderQRCode(transaction.qrCode);
  initTransactionConfirmImage(transaction);
  initRating(transaction);
  confirmReceiptSuccess(transaction);
}
function initRating(data){
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
  console.log(data);
  
  $('#myName').text(getUserInfo().fullName);
  senderId = data.transaction.senderId;
  receiverId = data.transaction.receiverId;
  if (receiverId == myUserId) {
    friendUserId = senderId;
    $('#friendName').text(data.transaction.sender.fullName);
  } else {
    friendUserId = receiverId;
    $('#friendName').text(data.transaction.receiver.fullName);
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
    $('#btnConfirmReceipt').hide();
  } else if (transaction.status == TRANSACTION_SENDER_RECEIPT_CONFRIMED) {
    if (USER_ID == transaction.senderId) {
      $('#receiptConfirmNotif').text('Người dùng đã xác nhận đơn của bạn');
    }
    if (USER_ID == transaction.receiverId) {
      $('#receiptConfirmNotif').text('Bạn xác nhận đơn chuyển hàng');
      $('#btnConfirmReceipt').hide();
    }
  } else if (transaction.status == TRANSACTION_RECEIVER_RECEIPT_CONFRIMED) {
    if (USER_ID == transaction.senderId) {
      $('#receiptConfirmNotif').text('Bạn đã xác nhận chuyển hàng');
      $('#btnConfirmReceipt').hide();
    }
    if (USER_ID == transaction.receiverId) {
      $('#receiptConfirmNotif').text('Người dùng đã xác nhận đơn của bạn');
    }
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