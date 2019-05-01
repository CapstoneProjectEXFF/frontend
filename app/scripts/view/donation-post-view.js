/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable no-extra-semi */
/* eslint-disable handle-callback-err */
// let transactions = [];
// let tracsactionsCategory = [];
// let targetValue;
$(document).ready(() => {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("id")) {
    let id = urlParams.get("id");
    let p1 = new Promise((resolve, reject) => {
      getDonationPost(
        id,
        (data) => {
          getDonationPostSuccess(data);
          resolve(data);
        },
        getDonationPostFalse
      );
    });
    let p2 = new Promise((resolve, reject) => {
      getDonatorOfDonationPost(
        id,
        (data) => {
          getDonatorSuccess(data);
          resolve(data);
        },
        getDonatorFalse
      );
    });
    Promise.all([p1, p2]).then((value) => {
      getCategoryCount(value[1], value[0].targets);
    });
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
    tradeOfferLink.attr("href", `./donation-send.html?donationPostId=${data.id}`);
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
function initTarget(data) {
  const targetTag = $('#target');
  const targets = data.targets;
  if (targets.length == 0) {
    $('#target').html('');
    $('#target').hide();
  } else {
    targetTag.html(renderTarget(targets));
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
  initTarget(data);
  initShareButton(data);
};
function getDonationPostFalse(err) {
  // console.log(err);
  window.location.href = ("./error404.html");
};

function getDonatorSuccess(data) {
  const donatorList = $('#donatorList');
  const donatorNum = $('#donatorNum');
  // getCategoryCount(data);
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
  console.log(err);
  // window.location.href = ("./error404.html");
};

function getCategoryCount(data, donationTarget) {
  if (donationTarget.length <= 0) {
    return;
  }
  let transactions = data;
  let tracsactionsCategory = transactions.map((elem) => {
    let { details } = elem;
    let tmpDetails = details.map(i => i.item.category.id);
    return tmpDetails;
  });
  let res = [];
  tracsactionsCategory.forEach(element => {
    res = res.concat(element);
  });

  let targetValue = res.reduce((accumulator, current) => {
    accumulator['' + current] = (accumulator[current] || 0) + 1;
    return accumulator;
  }, {});
  let targetValueMax = getMaxTarget(donationTarget);
  targetValue = Object.entries(targetValue);
  targetValue.forEach(([categoryId, value]) => {
    let tag = $(`#targetProcess${categoryId}`);
    let tagValue = $(`#targetProcessValue${categoryId}`);
    if (targetValueMax[categoryId] != undefined) {
      if (targetValueMax[categoryId] <= 0) {
        tag.animate({ width: '100%' }, 500);
      } else {
        let percent = value / targetValueMax[categoryId] * 100;
        tag.animate({ width: percent + '%' }, 500);
        tagValue.text(`${value}/${targetValueMax[categoryId]}`);
      }
    }
  });
}

function getMaxTarget(donationTarget) {
  return donationTarget.reduce((accumulator, current) => {
    let { categoryId, target } = current;
    accumulator['' + categoryId] = target;
    return accumulator;
  }, {});
}

function renderTarget(targets) {
  let targetTagList = '';
  targets.forEach(target => {
    let value = (target.target > 0) ? `0/${target.target}` : 'Không giới hạn';
    targetTagList += `
    <p>${target.category.name}: <span id="targetProcessValue${target.category.id}">${value}</span></p>
    <div class="progress" style="height:1.2em">
      <div class="progress-bar primary" style="width:0%;" id="targetProcess${target.category.id}"></div>
    </div>
    `;
  });
  return `
    <h3>Mục tiêu:</h3>
    ${targetTagList}
  `;
}
