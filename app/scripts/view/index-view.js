/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */
$(document).ready(() => {
  getItemsByStatus(
    ITEM_ENABLE,
    getItemsSuccess,
    getItemsFalse
  );
  getDonationPosts(
    0,
    10,
    getDonationPostsSuccess,
    getDonationPostsFalse
  );
  $("#itemsContainer").show();
  $("#postsContainer").hide();
});
function getItemsSuccess(data) {
  const itemsTag = $("#items");
  itemsTag.html("");
  if (data.length === 0) {
    itemsTag.html("<h1>Không có đồ dùng nào.</h1>");
  }
  data.forEach(item => {
    const card = createItemCard(item);
    itemsTag.append(card);
  });
};
function getItemsFalse(err) {
  const itemsTag = $("#items");
  itemsTag.html("<h1>Không có đồ dùng nào.</h1>");
};

function getDonationPostsSuccess(data) {
  const donationPostsTag = $("#donationPosts");
  donationPostsTag.html("");
  if (data.length === 0) {
    donationPostsTag.html("<h1>Không có bài viết nào.</h1>");
  }
  data.forEach(donationPost => {
    const card = renderDonationPostCard(donationPost);
    donationPostsTag.append(card);
  });
};
function getDonationPostsFalse(err) {
  const donationPostsTag = $("#donationPosts");
  donationPostsTag.html("<h1>Không có bài viết nào.</h1>");
};

function show(tagId) {
  const hideTagId = tagId === "#itemsContainer" ? "#postsContainer" : "#itemsContainer";
  $(tagId).show();
  $(tagId + "Tab").addClass("selected");
  $(hideTagId).hide();
  $(hideTagId + "Tab").removeClass("selected");
}
