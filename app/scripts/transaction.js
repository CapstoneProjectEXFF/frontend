const TRANSACTION_URL = '/transaction';

function addTransaction(
  receiverId,
  senderItems = [],
  receiverItems = [],
  donationPostId = -1,
  status = 0,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + TRANSACTION_URL;
  let data = {
    'transaction': {
      'receiverId': receiverId,
      'donationPostId': donationPostId,
      'status': status,
    },
    'details': createDetails(senderItems, receiverItems)
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
    })
    .then((responseJson) => {
      successCallback(responseJson);
    })
    .catch(err => {
      failCallback(err);
    });
}
function getReceivedTransaction(
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + TRANSACTION_URL;
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
function getTransaction(
  id,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + TRANSACTION_URL + `/${id}`;
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
function createDetails(senderItems, receiverItems) {
  let details = [];
  senderItems.forEach(item => {
    details.push({
      'itemId': item.id,
      'userId': item.user.id
    })
  });
  receiverItems.forEach(item => {
    details.push({
      'itemId': item.id,
      'userId': item.user.id
    })
  });
  return details;
}