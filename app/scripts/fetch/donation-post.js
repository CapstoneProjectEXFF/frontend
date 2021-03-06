const DONATION_POST_URL = '/donationPost';

function addDonationPost(
  title,
  content,
  address,
  urls = [],
  targets = [],
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + DONATION_POST_URL;
  let data = {
    'donationPost': {
      'title': title,
      'content': content,
      'address': address
    },
    'urls': urls,
    'targets': targets
  };
  let options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': getAuthentoken()
    }
  };
  fetchApi(
    url,
    options,
    successCallback,
    failCallback
  );
}

function updateDonationPost(
  id,
  title,
  content,
  address,
  urls = [],
  removedUrlIds = [],
  targets = [],
  removeTargets = [],
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + DONATION_POST_URL + `/${id}`;
  let data = {
    'donationPost': {
      'title': title,
      'content': content,
      'address': address
    },
    'newUrls': urls,
    'removedUrlIds': removedUrlIds,
    'targets': targets,
    'removeTargets': removeTargets
  };
  let options = {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': getAuthentoken()
    }
  };
  fetchApi(
    url,
    options,
    successCallback,
    failCallback
  );
}

function getDonationPost(
  id,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + DONATION_POST_URL + `/${id}`;
  let options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  fetchApi(
    url,
    options,
    successCallback,
    failCallback
  );
}

function getDonationPosts(
  page = 0,
  size = 10,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + DONATION_POST_URL + `?page=${page}&size=${size}`;
  let options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  fetchApi(
    url,
    options,
    successCallback,
    failCallback
  );
}
function searchDonationPosts(
  searchValue = '',
  page = 0,
  size = 10,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + DONATION_POST_URL + `/search?searchValue=${searchValue}&page=${page}&size=${size}`;
  let options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  fetchApi(
    url,
    options,
    successCallback,
    failCallback
  );
}

function getDonationPostByUserId(
  userId,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + `/user/${userId}` + DONATION_POST_URL;
  let options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      return response.json();
    }).then((responseJson) => {
      successCallback(responseJson);
    })
    .catch(err => {
      failCallback(err);
    });
}

function renderDonatorCard(data) {
  const { transaction, details } = data;
  const { sender, modifyTime } = transaction;

  const avatar = (sender.avatar !== null && sender.avatar !== undefined)
    ? (sender.avatar)
    : ('./images/user.png');
  return `
  <div class="user__info flex" id="userInfo">
    <div class="user__avatar position--relative">
      <div id="avatar" class="background" style="background-image: url(${avatar})">
      </div>
    </div>
    <div class="flex flex_justify__center flex_vertical">
      <a class="primary" href="./inventory.html?userId=${sender.id}">
        <p><b>${sender.fullName}</b></p>
      </a>
      <p>Quyên góp <b>${details.length}</b> đồ dùng.</p>
      <p class="datetime">- ${formatTime(modifyTime)}</p>
    </div>
  </div>
  `;
}

function renderDonationPostCard(donationPost, isEdit = false) {
  const { user } = donationPost;
  const image = (donationPost.images !== undefined && donationPost.images.length > 0)
    ? (donationPost.images[0].url)
    : ('./images/default-donation-post.png');
  const avatar = (user.avatar !== null && user.avatar !== undefined)
    ? (user.avatar)
    : ('./images/user.png');
  const action = isEdit ? (
    `
    <div class="post__action flex flex_justify__space_between">
      <a class="reset edit" href="./manage-donation.html?id=${donationPost.id}">
        <i class="fas fa-tasks"></i> Quản lý
      </a>
      <a class="reset edit" href="./form-donation-post.html?id=${donationPost.id}">
        <i class="fas fa-edit"></i> Chỉnh sửa nội dung
      </a>
    </div>`
  ) : '';
  const donateAction = (user.id + '' !== getUserId()) ? (
    `<a class="reset donation_action" href="./donation-send.html?donationPostId=${donationPost.id}">
      <button class="primary">Quyên góp</button>
    </a>`
  ) : '';
  return (
    `<div class="post__outline">
      <div class="post">
        ${action}
        <div class="post__user__info">
          <div class="user__info clearfix">
            <div class="user__avatar float-left position--relative">
              <div id="avatar" class="background" style="background-image: url(${avatar})"></div>
            </div>
            <a class="reset" href="./inventory.html?userId=${user.id}">
              <p class="info__name ellipsis">${user.fullName}</p>
            </a>
            <p class="info__time ellipsis">${formatTime(donationPost.createTime)}</p>
            ${donateAction}
          </div>
            <p class="info__address ellipsis">- tại <b>${donationPost.address}</b></p>
        </div>
        <a class="reset" href="./donation-post.html?id=${donationPost.id}">
          <div class="post__info">
            <p class="info__content ellipsis">${donationPost.title}</p>
            <p class="info__content ellipsis">${donationPost.content}</p>
          </div>
          <div class="post__image position--relative">
            <div class="background" style="background-image: url(${image})"></div>
          </div>
        </a>
      </div>
    </div>`
  );
}
function renderSetDonationTarget(category) {
  let check = (category.target > 0);
  let checkButton = check ? '<i class="fas fa-check-square"></i>' : '<i class="far fa-square"></i>';
  let hide = check ? '' : 'style="display: none;"';
  let checked = check ? 'checked' : '';
  return `
    <tr id="targetCheck${category.id}">
      <td style="font-size: 1.2em; cursor: pointer; width:300px" onclick="checkTarget('${category.id}')">
        <span style="color: #0c8ae8">${checkButton}</span>
        <input type="checkbox" name="target" style="display:none;" ${checked}/>
        ${category.name}
      </td>
      <td><input class="mystyle reset border--bottom text-align--right" ${hide} size="10" type="number" name="target" id="targetNum" value=${category.target} min=0 default=0></td>
    </tr>
  `;
}
function renderSetDonationTargetTable(categories) {
  let res = '';
  categories.forEach(category => {
    res += renderSetDonationTarget(category);
  });
  return res;
}
