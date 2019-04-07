const DONATION_POST_URL = '/donationPost';

function addDonationPost(
  title,
  content,
  address,
  urls = [],
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + DONATION_POST_URL;
  let data = {
    'title': title,
    'content': content,
    'address': address,
    'urls': urls
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
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + DONATION_POST_URL + `/${id}`;
  let data = {
    'id': id,
    'title': title,
    'content': content,
    'address': address,
    'urls': urls
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

// function getItemsByUserId(
//   userId,
//   successCallback = DEFAULT_FUNCTION,
//   failCallback = DEFAULT_FUNCTION
// ) {
//   let url = API_URL + `/user/${userId}` + ITEM_URL;
//   let options = {
//     method: 'GET',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     }
//   };
//   fetch(url, options)
//     .then((response) => {
//       if (!response.ok) {
//         var error = new Error(response.statusText);
//         error.response = response;
//         throw error;
//       }
//       return response.json();
//     }).then((responseJson) => {
//       successCallback(responseJson);
//     })
//     .catch(err => {
//       failCallback(err);
//     });
// }

function createDonationPostCard(donationPost, isEdit = false) {
  const image = (donationPost.images[0] !== null && donationPost.images[0] !== undefined)
    ? (donationPost.images[0].url)
    : ('./images/no-image-icon-13.png');
  const action = isEdit ? (
    `<hr>
    <div class="post__action clearfix">
      <a class="primary float-right" href="./form-donation-post.html?id=${donationPost.id}">
        <i class="fas fa-edit"></i> Edit
      </a>
    </div>`
  ) : '';
  const donateAction = (donationPost.user.id !== getUserId()) ? (
    `<a class="reset" href="./donation-send.html?donationPostId=${donationPost.user.id}">
      <button class="primary">Quyên góp</button>
    </a>`
  ) : '';
  return (
    `<div class="post__outline">
      <div class="post">
        <div class="post__user__info">
          <div class="user__info">
            <p class="info__name ellipsis">${donationPost.user.fullName}</p>
            <p class="info__time ellipsis">${moment(donationPost.createTime).format("DD/MM/YYYY")}</p>
          </div>
          ${donateAction}
        </div>
        <a class="reset" href="./donation-post.html?id=${donationPost.id}">
          <div class="post__info">
            <p class="info__content ellipsis">${donationPost.content}</p>
            <p class="info__address ellipsis">${donationPost.address}</p>
          </div>
          <div class="post__image position--relative">
            <div class="background" style="background-image: url(${image})"></div>
          </div>
        </a>
        ${action}
      </div>
    </div>`
  );
}
