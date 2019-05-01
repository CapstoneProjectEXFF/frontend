/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */

let itemPage = 0;
let donationPostPage = 0;
let isDonationLoading = false;
let isItemLoading = false;
let slideShowPos = 0;
let slideShowMaxPos = 0;
let slideShowWidth = 100;
let slideShowDirect = true;

$(document).ready(() => {
  getItemsPaging(
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
  initSlideShow();
  $(window).scroll(function () {
    // console.log([
    //   $(window).scrollTop(),
    //   $(document).height() - $(window).height(),
    //   ($(window).scrollTop() >= $(document).height() - $(window).height() - 50),
    //   isDonationLoading
    // ]);
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
          getItemsPaging(
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
function initSlideShow() {
  getDonationPosts(
    0,
    5,
    getDonationPostsSlideSuccess
  );
}
function getDonationPostsSlideSuccess(data) {
  const tag = $('#indexSlideShow');
  // console.log(data);
  if (data.length > 0) {
    tag.html('');
    data.forEach(donationPost => {
      tag.append(renderSlideShowItem(donationPost));
    });
    $('#indexSlideShow').css('width', data.length * 100 + '%');
    $('.index__slide_show__item').css('width', 100 / data.length + '%');
    startSlide(data.length, 100 / data.length);
  }
}
function startSlide(num, width) {
  slideShowMaxPos = num;
  slideShowWidth = width;
  if (num <= 0) {
    return;
  }
  setInterval(function () {
    // console.log('current' + slideShowPos);
    if (slideShowDirect) {
      $('#indexSlideShow').animate({ left: '-' + 100 * slideShowPos + '%' }, 1000);
      slideShowPos++;
      if (slideShowPos >= slideShowMaxPos) {
        slideShowPos -= 2;
        slideShowDirect = false;
      }
    } else {
      $('#indexSlideShow').animate({ left: '-' + 100 * slideShowPos + '%' }, 1000);
      slideShowPos--;
      if (slideShowPos < 0) {
        slideShowPos += 2;
        slideShowDirect = true;
      }
    }
    // console.log('after' + slideShowPos);
  }, 4000);
}
function renderSlideShowItem(data) {
  const image = (data.images != undefined && data.images.length > 0)
    ? data.images[0].url
    : './images/default-donation-post.jpg';
  const user = data.user;
  const avatar = (user.avatar !== null && user.avatar !== undefined)
    ? (user.avatar)
    : ('./images/user.png');
    const target = renderTarget(data.targets);
  return `
  <div class="index__slide_show__item position--relative float-left">
    <div class="background background--paralax" style="background-image: url('${image}')">
    </div>
    <div class="index__slide_show__item__content">
      <div>
        <h1>${data.title}</h1>
        <p class="ellipsis">${data.address}</p>
        <p class="ellipsis">${target}</p>
        <p></p>
        <a href="./donation-post.html?id=${data.id}">
          <button class="white--o">Chi tiết</button>
        </a>
        <p>&#9473;&#9473;&#9473;&#9473;&#9473;&#9473;</p>
        <div class="clearfix" style="line-height: 36px">
          <div class="square-36px round float-right position--relative">
          <div class="background" style="background-image: url('${avatar}')"></div>
          </div>
          <span class="float-right">${user.fullName}&nbsp;</span>
        </div>
      </div>
    </div>
  </div>
  `;
}
function renderTarget(data) {
  let res = '<b>Quyên góp:</b> ';
  // console.log(data);
  if (data.length == 0) {
    res = 'Quyên góp mọi loại đồ dùng';
  } else {
    data.forEach((target, i) => {
      if (i > 0) {
        res += ', ';
      } else {
        res += ' ';
      }
      res += target.category.name;
    });
  }
  return res;
}
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
  itemPage--;
  isItemLoading = false;
  // itemsTag.html("<h2>Không có thêm đồ dùng nào.</h2>");
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
