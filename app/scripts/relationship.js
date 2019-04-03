const RELATIONSHIP_URL = '/relationship';

function getAddFriendRequest(
  page = 0,
  size = 10,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + RELATIONSHIP_URL + `?page=${page}&size=${size}`;
  let options = {
    method: 'GET',
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
    })
    .then((responseJson) => {
      successCallback(responseJson);
    })
    .catch(err => {
      failCallback(err);
    });
}

function confirmAddFriendRequest(
  id,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + RELATIONSHIP_URL;
  let data = {
    "id": id
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
    })
    .then((responseJson) => {
      successCallback(responseJson, id);
    })
    .catch(err => {
      failCallback(err);
    });
}

function sendAddFriendRequest(
  userId,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + RELATIONSHIP_URL;
  let data = {
    "receiverId": userId
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

function checkFriendStatus(
  userId,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + RELATIONSHIP_URL + `/check`;
  let data = {
    "receiverId": userId
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

function removeFriend(
  id,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + RELATIONSHIP_URL;
  let data = {
    "id": id
  };
  let options = {
    method: 'DELETE',
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
    })
    .then((responseJson) => {
      successCallback(responseJson, id = -1);
    })
    .catch(err => {
      failCallback(err);
    });
}
