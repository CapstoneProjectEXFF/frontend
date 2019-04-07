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
function getUserById(
  userId,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + USER_URL + `/${userId}`;
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

function findUserByName(
  name,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + `/name?name=${name}`;
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
  // const addFriendButton = (user.id + '' !== getUserId())
  //   ? `<div><button class="primary size--mini">Thêm bạn</button></div>`
  //   : '';
  return (
    `<div class="list__card__avatar background--color-white" id="user${user.id}">
      <div class="list__card__avatar__image position--relative">
        <div class="background" style="background-image: url(${image})"></div>
      </div>
      <div class="list__card__avatar__info">
        <a class="reset" href="./inventory.html?userId=${user.id}">
          <div class="flex flex_vertical flex_grow__1">
            <h3 class="ellipsis">${user.fullName}</h3>
            <h5 class="ellipsis">${user.phoneNumber}</h5>
          </div>
        </a>
      </div>
    </div>`
  );
}

