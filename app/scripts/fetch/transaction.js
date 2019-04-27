const TRANSACTION_URL = '/transaction';
const DONATION_URL = '/donators';
const NOTIF_URL = '/notification';

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
  senderId,
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
      'senderId': senderId,
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
function getTransactionNotif(
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let id = getUserId();
  let url = NODE_URL + NOTIF_URL + `?userId=${id}`;

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
function getDonatorOfDonationPost(
  id,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + DONATION_URL + `/${id}`;
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
function getTransactionHistory(
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + TRANSACTION_URL + `/history`;
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
    getUserId(),
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
    getUserId(),
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

function uploadTransactionReceipt(
  id,
  receiptUrl,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + TRANSACTION_URL + '/uploadReceipt';
  let data = {
    'id': Number(id),
    'url': receiptUrl
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
function confirmTransactionReceipt(
  id,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + TRANSACTION_URL + '/confirmReceipt';
  let data = {
    'id': Number(id)
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



function renderTransactionHistory(transaction) {
  return `
    <a class="reset" href='./transaction-confirm.html?id=${transaction.id}'>
      <div class="transaction__container">
        <div class="transaction__info">
          <p>Thời gian: ${formatTime(transaction.createTime)}</p>
        </div>
        <div class="transaction__userinfo clearfix position--relative">
          <div class="float-left">
            <p class="ellipsis">${transaction.sender.fullName}</p>
            <p class="ellipsis">${transaction.sender.phoneNumber}</p>
          </div>
          <div class="float-right">
            <p class="ellipsis">${transaction.receiver.fullName}</p>
            <p class="ellipsis">${transaction.receiver.phoneNumber}</p>
          </div>
          <i class="fas fa-exchange-alt"></i>
        </div>
      </div>
    </a>  `;
}
