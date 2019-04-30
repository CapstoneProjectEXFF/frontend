/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */

let itemPage = 0;
let donationPostPage = 0;
let isDonationLoading = false;
let isItemLoading = false;

$(document).ready(() => {
  getItemsByStatus(
    ITEM_ENABLE,
    itemPage,
    12,
    getItemsSuccess,
    getItemsFalse
  );
  getDonationPosts(
    donationPostPage,
    10,
    getDonationPostsSuccess,
    getDonationPostsFalse
  );
  $("#itemsContainer").show();
  $("#postsContainer").hide();
  $(window).scroll(function () {
    console.log([
      $(window).scrollTop(),
      $(document).height() - $(window).height(),
      ($(window).scrollTop() >= $(document).height() - $(window).height() - 50),
      isDonationLoading
    ]);
    if ($(window).scrollTop() >= $(document).height() - $(window).height() - 50) {
      if ($('#itemsContainer').is(':hidden')) {
        if (!isDonationLoading) {
          isDonationLoading = true;
          donationPostPage++;
          getDonationPosts(
            donationPostPage,
            10,
            getDonationPostsSuccess,
            getDonationPostsFalse
          );
        }
      } else {
        if (!isItemLoading) {
          isItemLoading = true;
          itemPage++;
          getItemsByStatus(
            ITEM_ENABLE,
            itemPage,
            12,
            getItemsSuccess,
            getItemsFalse
          );
        }
      }
    }
  });
});
function getItemsSuccess(data) {
  const itemsTag = $("#items");
  // itemsTag.html("");
  if (data.length === 0) {
    itemPage--;
    // itemsTag.html("<h2>Không có thêm đồ dùng nào.</h2>");
  }
  data.forEach(item => {
    const card = createItemCard(item);
    itemsTag.append(card);
  });
  isItemLoading = false;
}
function getItemsFalse(err) {
  const itemsTag = $("#items");
  itemsTag.html("<h2>Không có thêm đồ dùng nào.</h2>");
}

function getDonationPostsSuccess(data) {
  const donationPostsTag = $("#donationPosts");
  // donationPostsTag.html("");
  if (data.length === 0) {
    donationPostPage--;
    // donationPostsTag.append("<h2>Không thêm có bài viết nào.</h2>");
  } else {
    data.forEach(donationPost => {
      const card = renderDonationPostCard(donationPost);
      donationPostsTag.append(card);
    });
    isDonationLoading = false;
  }
}
function getDonationPostsFalse(err) {
  const donationPostsTag = $("#donationPosts");
  // donationPostsTag.html("<h1>Không có bài viết nào.</h1>");
  donationPostPage--;
  isDonationLoading = false;
}

function show(tagId) {
  const hideTagId = tagId === "#itemsContainer" ? "#postsContainer" : "#itemsContainer";
  $(tagId).show();
  $(tagId + "Tab").addClass("selected");
  $(hideTagId).hide();
  $(hideTagId + "Tab").removeClass("selected");
}
