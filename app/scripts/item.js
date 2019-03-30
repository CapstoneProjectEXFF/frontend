const ITEM_URL = '/item';

function addItem(
  category,
  name,
  description,
  address,
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
    'address': address,
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
  address,
  privacy,
  urls = [],
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + ITEM_URL + `/${id}`;
  let data = {
    'id': id,
    'category': category,
    'name': name,
    'description': description,
    'address': address,
    'privacy': privacy,
    'newUrls': urls,
    'removedUrlIds': []
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

function getItemsByStatus(
  status = ITEM_ENABLE,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + ITEM_URL + `?status=${status}`;
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
  let url = API_URL + `/user/${userId}` + ITEM_URL + `?status=${status}`;
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
          <p class="ellipsis"><i>${moment(item.createTime).format("DD/MM/YYYY")}</i></p>
        </div>
    </div>`
  );
}
function createTradeOfferContentItem(item, isClickable = false) {
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
          <p class="ellipsis"><i>${moment(item.createTime).format("DD/MM/YYYY")}</i></p>
        </div>
    </div>`
  );
}
function createItemCard(item, isEdit = false) {
  const image = (item.images[0] !== null && item.images[0] !== undefined)
    ? (item.images[0].url)
    : ('./images/no-image-icon-13.png');
  const action = isEdit ? (
    `<hr>
    <div class="card__action clearfix">
      <a class="primary float-right" href="./form-item.html?id=${item.id}">
        <i class="fas fa-edit"></i> Edit
      </a>
    </div>`
  ) : '';
  return (
    `<div class="card">
      <a class="reset" href="./item.html?id=${item.id}">
        <div class="card__image position--relative">
          <div class="background" style="background-image: url(${image})"></div>
        </div>
        <div class="card__info">
          <h3 class="ellipsis">${item.name}</h3>
          <p class="ellipsis">${item.description}</p>
        </div>
      </a>
      ${action}
    </div>`
  );
}
/* <span class="delete float-right">
      <i class="fas fa-trash"></i> Delete
    </span>
    <span class="float-right">&nbsp;&nbsp;|&nbsp;&nbsp;</span> */
