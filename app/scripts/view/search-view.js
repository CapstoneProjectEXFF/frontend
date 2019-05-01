/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */
let searchValue;
let categoryValue;
$(document).ready(() => {
  initSearchValueFromUrl();
  initSearchView();
  // $("#itemsContainer").show();
  // $("#postsContainer").hide();
});
function initSearchValueFromUrl(params) {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("search")) {
    searchValue = urlParams.get("search");
    $('#inputSearch').val(searchValue);
    searchUserByNameInView();
    searchItemInView();
    searchDonationInView(0, 10);
  } else if (urlParams.has("phone")) {
    searchValue = urlParams.get("phone");
    $('#inputSearch').val(searchValue);
    searchUserByPhoneInView();
  } else {
    searchValue = '';
    searchUserByNameInView();
    searchItemInView();
    searchDonationInView(0, 10);
  }
}
function initSearchView() {
  categoryValue = 0;
  $("#category").html('<option value="0">Tất cả</option>');
  $("#category").val(categoryValue);
  getCategory(getCategorySuccess);
  $('#searchFormInSearch').submit((event) => {
    event.preventDefault();
    searchValue = $('#inputSearch').val();
    if (/^[0-9]{1,10}$/.test(searchValue)) {
      $('#usersContainerTab').click();
      searchUserByPhoneInView();
    } else {
      searchUserByNameInView();
      searchItemInView();
      searchDonationInView(0, 10);
    }

  });
}
function searchUserByPhoneInView() {
  findUserByPhone(
    searchValue,
    getUserSuccess,
    getUserFalse
  );
}
function searchUserByNameInView() {
  findUserByName(
    searchValue,
    getUsersSuccess,
    getUserFalse
  );
}
function searchItemInView() {
  searchItems(
    searchValue,
    categoryValue,
    0,
    getItemsSuccess,
    getItemsFalse
  );
}
function searchDonationInView(page, site) {
  searchDonationPosts(
    searchValue,
    page,
    site,
    getDonationPostsSuccess,
    getDonationPostsFalse
  );
}

function getUserSuccess(data) {
  const usersTag = $("#users");
  usersTag.html("");
  if (data === null) {
    usersTag.html("<p>Không tìm thấy người nào.</p>");
  } else {
    const card = createUserCard(data);
    usersTag.append(card);
  }
}
function getUsersSuccess(data) {
  const usersTag = $("#users");
  usersTag.html("");
  if (data === null) {
    usersTag.html("<p>Không tìm thấy người nào.</p>");
  }
  data.forEach(user => {
    const card = createUserCard(user);
    usersTag.append(card);
  });
}
function getUserFalse(err) {
  const usersTag = $("#users");
  usersTag.html("<p>Không tìm thấy người nào.</p>");
}
function getItemsSuccess(data) {
  const itemsTag = $("#items");
  itemsTag.html("");
  if (data.length === 0) {
    itemsTag.html("<p>Không có đồ dùng nào.</p>");
  }
  data.forEach(item => {
    const card = createItemCard(item);
    itemsTag.append(card);
  });
}
function getItemsFalse(err) {
  const itemsTag = $("#items");
  itemsTag.html("<p>Không có đồ dùng nào.</p>");
}

function getDonationPostsSuccess(data) {
  const donationPostsTag = $("#donationPosts");
  donationPostsTag.html("");
  if (data.length === 0) {
    donationPostsTag.html("<p>Không có bài viết nào.</p>");
  }
  data.forEach(donationPost => {
    const card = renderDonationPostCard(donationPost);
    donationPostsTag.append(card);
  });
}
function getDonationPostsFalse(err) {
  const donationPostsTag = $("#donationPosts");
  donationPostsTag.html("<p>Không có bài viết nào.</p>");
}
function getCategorySuccess(data) {
  console.log(data);
  let options = "";
  let groupOption = "";
  const selectTag = $("#category");
  selectTag.html('<option value="0" style="font-weight: bold;">Tất cả</option>');

  data.forEach(category => {
    let option = $("<option/>");
    if (category.supercategoryId === null) {
      option.css('font-weight', 'bold');
    }
    option.text(category.name);
    option.val(category.id);
    selectTag.append(option);
  });
  selectTag.change(() => categoryValue = $("#category").val());
}
function show(tagId = 'allContainer') {
  $(".tab").removeClass("selected");
  $(".allContainer").hide();
  $('#' + tagId + "Tab").addClass("selected");
  $("." + tagId).show();
}
