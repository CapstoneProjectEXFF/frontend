const TRANSACTION_URL = '/transaction';

function createDetails(senderItems, receiverItems) {
  let details = [];
  senderItems.forEach(item => {
    details.push({
      'itemId': item.id,
      'userId': item.user.id
    });
  });
  receiverItems.forEach(item => {
    details.push({
      'itemId': item.id,
      'userId': item.user.id
    });
  });
  return details;
}

function addTransaction(
  receiverId,
  details = [],
  donationPostId = null,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  if (details.length <= 0) {
    failCallback("Empty details");
    return;
  }
  let url = API_URL + TRANSACTION_URL;
  let data = {
    'transaction': {
      'receiverId': receiverId,
      'donationPostId': donationPostId
    },
    'details': details
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
  fetchApi(
    url,
    options,
    successCallback,
    failCallback
  );
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
  fetchApi(
    url,
    options,
    successCallback,
    failCallback
  );
}

function confirmTransaction(
  id,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + TRANSACTION_URL + `/${id}`;
  let options = {
    method: 'PUT',
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

function updateTransaction(
  id,
  receiverId,
  details = [],
  donationPostId = null,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  if (details.length <= 0) {
    failCallback("Empty details");
    return;
  }
  let url = API_URL + TRANSACTION_URL;
  let data = {
    'transaction': {
      'id': id,
      'receiverId': receiverId,
      'donationPostId': donationPostId
    },
    'details': details
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

function deleteTransaction(
  id,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + TRANSACTION_URL;
  let data = {
    'transaction': {
      'id': id
    },
    'details': []
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
  fetchApi(
    url,
    options,
    successCallback,
    failCallback
  );
}

function addTradeOffer(
  receiverId,
  details = [],
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  addTransaction(
    receiverId,
    details,
    null,
    successCallback,
    failCallback
  );
}

function addDonationTransaction(
  receiverId,
  details = [],
  donationPostId,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  addTransaction(
    receiverId,
    details,
    donationPostId,
    successCallback,
    failCallback
  );
}

function updateTradeOffer(
  id,
  receiverId,
  details,
  successCallback
) {
  updateTransaction(
    id,
    receiverId,
    details,
    null,
    successCallback
  );
}

