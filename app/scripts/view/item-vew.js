/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */
$(document).ready(() => {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("id")) {
    let id = urlParams.get("id");
    getItem(
      id,
      getItemSuccess,
      getItemFalse
    );
  } else {
    window.location.replace("./error404.html");
  }
});
function initView(data) {

  const date = $("#date");
  const category = $("#itemCategory");
  const name = $("#itemName");
  const description = $("#itemDescription");
  const address = $("#itemAddress");

  const tradeOfferLink = $("#tradeOfferLink");
  let time = formatTime(data.createTime);

  date.text(time);
  category.text(data.category.name);
  name.text(data.name);
  description.text(data.description);
  address.text(data.user.address);
  if (data.user.id != getUserId()) {
    tradeOfferLink.show();
    tradeOfferLink.attr("href", `./chat.html?userId=${data.user.id}&itemId=${data.id}`);
  }
  initUserInfo(data.user);
  initSlideShow(data.images);
}
function initUserInfo(data) {
  const user = $("#user");
  const phoneNumber = $("#phoneNumber");
  const avatar = $('#avatar');
  const link = $('#userLink');

  let image = data.avatar;

  user.text(data.fullName);
  phoneNumber.text(data.phoneNumber);
  link.attr('href', `./inventory.html?userId=${data.id}`);
  if (image !== undefined && image !== null) {
    avatar.css('background-image', `url(${image})`);
  }
}

function initSlideShow(images) {
  const imageContainer = $("#imageContainer");
  imageContainer.append(renderSlideShow(images));
}
function initShareButton(data) {
  overrideLink = `https://exff.ml/item.html?id=${data.id}`;
  overrideTitle = data.name;
  overrideDescription = data.description;
  if (data.images != null && data.images.length > 0) {
    overrideImage = data.images[0].url;
  }
  $('#ogUrl').attr('content', `https://exff.ml/item.html?id=${data.id}`);
  $('#ogTitle').attr('content', data.name);
  $('#ogDescription').attr('content', data.description);
  $('#shareUrl').attr('data-href', `https://exff.ml/item.html?id=${data.id}`);
  if (data.images != null && data.images.length > 0) {
    $('#ogImgae').attr('content', data.images[0].url);
  }

}
function getItemSuccess(data) {
  initShareButton(data);
  initView(data);
  searchItems(
    '',
    data.category.id,
    0,
    getItemsSuccess,
    getItemsFalse
  );
}
function getItemFalse(err) {
  // console.log(err);
  window.location.href = ("./error404.html");
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
