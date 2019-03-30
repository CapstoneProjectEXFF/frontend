const USER_URL = '/user';

function getUser(
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + USER_URL + `/${getUserId()}`;
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

function updateUser(
  data,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + USER_URL + `/updateInfo`;
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

function updateUserPasword(
  data,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + USER_URL + `/changePassword`;
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

function findUserByPhone(
  phone,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + `/phone?phone=${phone}`;
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

function getChatRoom(
  userID,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = `http://35.247.191.68:3000/trading?userId=${userID}`;
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

function createUserCard(user) {
  const image = (user.avatar !== null && user.avatar !== undefined)
    ? (user.avatar)
    : ('./images/no-image-icon-13.png');
  return (
    `<div class="list__item" id="user${user.id}">
      <div class="list__item__image position--relative">
        <div class="background" style="background-image: url(${image})"></div>
      </div>
      <div class="list__item__info">
        <h5 class="ellipsis">${user.fullName}</h5>
        <h2 class="ellipsis">${user.phoneNumber}</h2>
        <button class="primary">Thêm bạn</button>
      </div>
    </div>`
  );
}
function createChatRoom(user) {
  const image = (user.avatar !== null && user.avatar !== undefined)
    ? (user.avatar)
    : ('./images/no-image-icon-13.png');
  return (
    `<div class="list__item" id="user${user.id}">
      <div class="list__item__image position--relative">
        <div class="background" style="background-image: url(${image})"></div>
      </div>
      <div class="list__item__info">
        <h5 class="ellipsis">${user.fullName}</h5>
        <h2 class="ellipsis">${user.phoneNumber}</h2>
      </div>
    </div>`
  );
}
