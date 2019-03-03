const ITEM_URL = '/item';

function addItem(
  category,
  name,
  description,
  address,
  privacy,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + ITEM_URL;
  let data = {
    'category': category,
    'name': name,
    'description': description,
    'address': address,
    'privacy': privacy
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
  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      return response.json();
    }).then((responseJson) => {
      const json = responseJson;
      successCallback(responseJson);
    })
    .catch(err => {
      failCallback(err);
    });
}

function updateItem(
  id,
  category,
  name,
  description,
  address,
  privacy,
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
    'privacy': privacy
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
function getItemsByUserId(
  userId,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + `/user/${userId}` + ITEM_URL;
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
function createTradeOfferIventoryItem(item) {
  return (
    `<div class="list__item" id="item${item.id}" onclick="selectItem(${item.id},${item.user.id})">
      <div class="list__item__image position--relative">
        <div class="background" style="background-image: url()"></div>
      </div>
      <div class="list__item__info">
          <h5 class="ellipsis">${item.category.name}</h5>
          <h2 class="ellipsis">${item.name}</h2>
          <p class="ellipsis"><i>${moment(item.createTime).format("DD/MM/YYYY")}</i></p>
        </div>
    </div>`
  );
}
function createTradeOfferContentItem(item) {
  return (
    `<div class="list__item" id="selectItem${item.id}" onclick="deselectItem(${item.id})">
      <div class="list__item__image position--relative">
        <div class="background" style="background-image: url()"></div>
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
  let action = isEdit?(
    `<hr>
    <div class="card__action clearfix">
      <a class="primary float-right" href="./form-item.html?id=${item.id}">
        <i class="fas fa-edit"></i> Edit
      </a>
    </div>`
  ):'';
  return (
    `<div class="card">
      <a class="reset" href="./item.html?id=${item.id}">
        <div class="card__image position--relative">
          <div class="background" style="background-image: url()"></div>
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
{/* <span class="delete float-right">
      <i class="fas fa-trash"></i> Delete
    </span>
    <span class="float-right">&nbsp;&nbsp;|&nbsp;&nbsp;</span> */}