/* eslint-disable eqeqeq */
/* eslint-disable no-extra-semi */
/* eslint-disable handle-callback-err */
$(document).ready(() => {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("id")) {
    let id = urlParams.get("id");
    getDonationPost(
      id,
      getDonationPostSuccess,
      getDonationPostFalse
    );
    getDonatorOfDonationPost(
      id,
      getDonatorSuccess,
      getDonatorSuccess
    );
  } else {
    window.location.replace("./error404.html");
  }
});
function initDonationPostView(data) {
  const user = $("#user");
  const avatar = $("#avatar");
  const date = $("#date");
  const address = $("#address");
  const postTitle = $("#postTitle");
  const postContent = $("#postContent");
  const image = $("#image");
  const userLink = $('#userLink');
  const tradeOfferLink = $("#tradeOfferLink");

  let time = formatTime(data.createTime);

  user.text(data.user.fullName);
  date.text(time);
  address.text(data.address);
  postTitle.text(data.title);
  postContent.text(data.content);
  userLink.attr('href', `./inventory.html?userId=${data.user.id}`);

  if (data.user.id != getUserId()) {
    tradeOfferLink.show();
    tradeOfferLink.attr("href", `./donation-send.html?donationPostId=${data.id}`)
  }

  if (data.images != null && data.images.length > 0) {
    image.css("background-image", `url(${data.images[0].url})`);
    initImageList(data.images);
  }

  if (data.user.avatar !== null && data.user.avatar !== undefined) {
    avatar.css("background-image", `url(${data.user.avatar})`);
  }
}
function initImageList(images) {
  let imageList = $('#imageList');
  for (let i = 1; i < images.length; i++) {
    const image = images[i];
    imageList.append(renderImage(image.url));
  }
}
function initShareButton(data) {
  overrideLink = `https://exff.ml/donation-post.html?id=${data.id}`;
  overrideTitle = data.title;
  overrideDescription = data.content;
  if (data.images != null && data.images.length > 0) {
    overrideImage = data.images[0].url;
  }
  $('#ogUrl').attr('content', `https://exff.ml/donation-post.html?id=${data.id}`);
  $('#ogTitle').attr('content', data.title);
  $('#ogDescription').attr('content', data.content);
  $('#shareUrl').attr('data-href', `https://exff.ml/donation-post.html?id=${data.id}`);
  if (data.images != null && data.images.length > 0) {
    $('#ogImgae').attr('content', data.images[0].url);
  }

}
function getDonationPostSuccess(data) {
  initDonationPostView(data);
  initShareButton(data);
};
function getDonationPostFalse(err) {
  // console.log(err);
  window.location.href = ("./error404.html");
};

function getDonatorSuccess(data) {
  const donatorList = $('#donatorList');
  const donatorNum = $('#donatorNum');
  if (data.length > 0) {
    data.forEach(elem => {
      donatorList.append(renderDonatorCard(elem));
    });
  } else {
    donatorList.html('<h3 style="text-align:center;">Bạn sẽ là người đầu tiên quyên góp.</h3>');
  }
  donatorNum.html(`${numeral(data.length).format('0,0')} `);
};
function getDonatorFalse(err) {
  console.log(data);
  // window.location.href = ("./error404.html");
};
