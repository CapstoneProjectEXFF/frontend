const ITEM_URL = '/item';

function addItem(
  category,
  name,
  description,
  preferItems,
  privacy,
  urls = [],
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + ITEM_URL;
  let data = {
    'category': category,
    'name': name,
    'description': description,
    'preferItems': preferItems,
    'privacy': privacy,
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

function updateItem(
  id,
  category,
  name,
  description,
  preferItems,
  privacy,
  urls = [],
  removedUrls = [],
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + ITEM_URL + `/${id}`;
  let data = {
    'id': id,
    'category': category,
    'name': name,
    'description': description,
    'preferItems': preferItems,
    'privacy': privacy,
    'newUrls': urls,
    'removedUrlIds': removedUrls
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

function getItem(
  id,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + ITEM_URL + `/${id}`;
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

function getItemsPaging(
  page = 0,
  size = 12,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + ITEM_URL + `?page=${page}&size=${size}`;
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
function getItems(
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + ITEM_URL;
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

function getItemsByUserId(
  userId,
  status = ITEM_ENABLE,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url;
  if (userId + '' === getUserId()) {
    url = API_URL + `/user/my` + ITEM_URL + `?status=${status}`;
  } else {
    url = API_URL + `/user/${userId}` + ITEM_URL + `?status=${status}`;
  }
  let options = {
    method: 'GET',
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
function getRecommendItems(
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  if (!isNotLogin()) {
    let url = NODE_URL + ITEM_URL + `/${getUserId()}`;
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
}
function getItemsByUserIdInChatRoom(
  userId,
  status = ITEM_ENABLE,
  friendId = 0,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url;
  if (userId + '' === getUserId()) {
    url = API_URL + `/user/my` + ITEM_URL + `?status=${status}&friendId=${friendId}`;
  } else {
    url = API_URL + `/user/${userId}` + ITEM_URL + `?status=${status}`;
  }
  let options = {
    method: 'GET',
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

function searchItems(
  name,
  categoryId = 0,
  page = 0,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let categoryQuery = (categoryId != null) ? `&categoryId=${categoryId}` : '';
  let url = API_URL + ITEM_URL + `/search?name=${name}${categoryQuery}&page=${page}`;
  let options = (getAuthentoken() === undefined || getAuthentoken() === null)
    ? {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    : {
      method: 'GET',
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

function createTradeOfferIventoryItem(item, isSelected = false) {
  const image = (item.images[0] !== null && item.images[0] !== undefined)
    ? (item.images[0].url)
    : ('./images/no-image-icon-13.png');
  const notDisplay = (isSelected) ? 'style="display:none"' : '';
  return (
    `<div class="list__item" id="item${item.id}" onclick="selectItem(${item.id},${item.user.id})" ${notDisplay}>
      <div class="list__item__image position--relative">
        <div class="background" style="background-image: url(${image})"></div>
      </div>
      <div class="list__item__info">
          <h5 class="ellipsis">${item.category.name}</h5>
          <h2 class="ellipsis">${item.name}</h2>
          <p class="ellipsis"><i>${formatTime(item.createTime)}</i></p>
        </div>
    </div>`
  );
}
function createTradeOfferContentItem(item, isClickable = false) {
  if (item === undefined || item === null) {
    return '';
  }
  const image = (item.images[0] !== null && item.images[0] !== undefined)
    ? (item.images[0].url)
    : ('./images/no-image-icon-13.png');
  const onclickaction = (isClickable) ? `onclick="deselectItem(${item.id},${item.user.id})"` : '';
  return (
    `<div class="list__item" id="selectItem${item.id}" ${onclickaction}>
      <div class="list__item__image position--relative">
        <div class="background" style="background-image: url(${image})"></div>
      </div>
      <div class="list__item__info">
          <h5 class="ellipsis">${item.category.name}</h5>
          <h2 class="ellipsis">${item.name}</h2>
          <p class="ellipsis"><i>${formatTime(item.createTime)}</i></p>
        </div>
    </div>`
  );
}
function createItemCard(item, isEdit = false) {
  const image = (item.images[0] !== null && item.images[0] !== undefined)
    ? (item.images[0].url)
    : ('./images/no-image-icon-13.png');
  const avatar = (item.user.avatar !== null && item.user.avatar !== undefined)
    ? (item.user.avatar)
    : ('./images/user.png');
  const action = isEdit ? (
    `
    <div class="card__action clearfix">
      <a class="primary float-right" href="./form-item.html?id=${item.id}">
        <i class="fas fa-edit"></i> Edit
      </a>
    </div>`
  ) : `
      <div class="card__user__info flex">
        <div class="avatar position--relative">
          <div class="background" style="background-image: url(${avatar})"></div>
        </div>
        <div class="flex flex_grow__1 flex_justify__center flex_vertical">
          <a class="reset" href="./inventory.html?userId=${item.user.id}">
            <p class="ellipsis">${item.user.fullName}</p>
          </a>
        </div>
      </div>`;
  return (
    `<div class="card">
      <a class="reset" href="./item.html?id=${item.id}">
        <div class="card__image position--relative">
          <div class="background" style="background-image: url(${image})"></div>
        </div>
        <div class="card__info">
          <p class="address ellipsis">${item.user.address}</p>
          <h4 class="ellipsis">${item.name}</h4>
          <p class="ellipsis">${item.description}</p>
        </div>
      </a>
      <hr class="gray no--margin"/>
      ${action}
    </div>`
  );
}
/* <span class="delete float-right">
      <i class="fas fa-trash"></i> Delete
    </span>
    <span class="float-right">&nbsp;&nbsp;|&nbsp;&nbsp;</span> */
