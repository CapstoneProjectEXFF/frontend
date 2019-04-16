/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */

let userId;
let isOwn = false;
$(document).ready(() => {
  checkLogin();
  initInventoryView();
});
function initInventoryView() {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("userId")) {
    userId = urlParams.get("userId");
    if (userId != getUserId()) {
      getUserById(
        userId,
        getUserSuccess,
        redirectTo404
      )
    } else {
      userId = getUserId();
      isOwn = true;
      renderUserInfo(getUserInfo());
    }
  } else {
    userId = getUserId();
    isOwn = true;
    renderUserInfo(getUserInfo());
  }
  getItemsByUserId(
    userId,
    ITEM_ENABLE,
    getItemsSuccess,
    getItemsFalse
  );
  getDonationPostByUserId(
    userId,
    getDonationPostsSuccess,
    getDonationPostsFalse
  )
  getTransactionHistory(
    initTransactionHistory
  );
}
function initFriendButton(data = {}) {
  $('#btnAddFriend').show();
  $('#btnCancelAddFriend').hide();
  $('#btnConfirmAddFriend').hide();
  $('#btnAddFriend').off("click");
  $('#btnAddFriend').click(() => {
    sendAddFriendRequest(
      userId,
      initCancleAddFriendButton
    )
  });
}
function initCancleAddFriendButton(data) {
  $('#btnAddFriend').hide();
  $('#btnCancelAddFriend').show();
  $('#btnConfirmAddFriend').hide();
  $('#btnConfirmAddFriend').off("click");
  $('#btnCancelAddFriend').off("click");
  $('#btnCancelAddFriend').click(() => {
    removeFriend(
      data.id,
      (data) => {
        initFriendButton();
      }
    )
  });
}
function initConfirmAddFriendButton(data) {
  $('#btnAddFriend').hide();
  $('#btnConfirmAddFriend').show();
  $('#btnCancelAddFriend').show();
  $('#btnConfirmAddFriend').off("click");
  $('#btnCancelAddFriend').off("click");
  $('#btnConfirmAddFriend').click(() => {
    confirmAddFriendRequest(
      data.id,
      (data, id) => {
        confirmAddFriendSuccess(data, id);
        initCancleAddFriendButton({ id: id });
      }
    );
  });
  $('#btnCancelAddFriend').click(() => {
    removeFriend(
      data.id,
      (data, id) => {
        confirmAddFriendSuccess(data, id);
        initFriendButton();
      }
    );
  });
}
function initAddFriendAction(data) {
  if (data.status === RELATIONSHIP_SEND && data.receiverId == getUserId()) {
    initConfirmAddFriendButton(data);
  } else {
    initCancleAddFriendButton(data);
  }
}
function initTransactionHistory(data) {
  const transactionHistoryTag = $('#transactionHistory');
  data.forEach(transaction => {
    transactionHistoryTag.append(
      renderTransactionHistory(transaction)
    );
  });
}

function getUserSuccess(data) {
  renderUserInfo(data);
  checkFriendStatus(
    data.id,
    initAddFriendAction,
    initFriendButton
  )
}
function getItemsSuccess(data) {
  const inventoryTag = $("#inventory");
  const itemNumTag = $("#userItemNum");
  inventoryTag.html("");
  itemNumTag.text(data.length);
  if (data.length === 0) {
    inventoryTag.html("<h1>Không có đồ dùng nào.</h1>");
  }
  data.forEach(item => {
    const card = createItemCard(item, isOwn);
    inventoryTag.append(card);
  });
};
function getItemsFalse(err) {
  const inventoryTag = $("#inventory");
  inventoryTag.html("<h1>Không có đồ dùng nào.</h1>");
};

function getDonationPostsSuccess(data) {
  const inventoryTag = $("#donationPost");
  const itemNumTag = $("#userPostNum");
  inventoryTag.html("");
  itemNumTag.text(data.length);
  if (data.length === 0) {
    inventoryTag.html("<h1>Không có bài viết nào.</h1>");
  }
  data.forEach(donationPost => {
    const card = renderDonationPostCard(donationPost, isOwn);
    inventoryTag.append(card);
  });
};
function getDonationPostsFalse(err) {
  const inventoryTag = $("#donationPost");
  inventoryTag.html("<h1>Không có bài viết nào.</h1>");
};
function renderUserInfo(user) {
  $('#userName').text(user.fullName);
  $('#userPhoneNum').text(user.phoneNumber);

  if (user.id == getUserId()) {
    $('#btnProfileEdit').show();
    $('#inventoryActionBar').show();
  }
  if (user.avatar !== undefined && user.avatar !== null) {
    $('#avatar').css('background-image', `url('${user.avatar}'`);
  }

}
function show(tagId = 'allContainer') {
  $(".tab").removeClass("selected");
  $(".allContainer").hide();
  $('#' + tagId + "Tab").addClass("selected");
  $("." + tagId).show();
}
