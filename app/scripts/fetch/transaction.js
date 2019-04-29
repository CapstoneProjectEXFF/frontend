/* eslint-disable eqeqeq */
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
  let user = (transaction.senderId != getUserId()) ? transaction.sender : transaction.receiver;
  const avatar = (user.avatar !== null && user.avatar !== undefined)
    ? (user.avatar)
    : ('./images/user.png');
  let info = `
    <div class="clearfix">
      <div class="user__avatar float-left position--relative">
        <div id="avatar" class="background" style="background-image: url(${avatar})"></div>
      </div>
      <p class="info__name ellipsis">${user.fullName}</p>
      <p class="info__time ellipsis">${user.phoneNumber}</p>
    </div>
  `;
  let status = (transaction.status == TRANSACTION_DONATE)
    ? 'Quyên góp'
    : (transaction.status == TRANSACTION_DONE)
      ? 'Hoàn thành'
      : 'Chưa chuyển đồ';
  let color = (transaction.status == TRANSACTION_DONATE)
    ? '#2962ff'
    : (transaction.status == TRANSACTION_DONE)
      ? '#64dd17'
      : '#7b1fa2';

  return `
    <a class="reset" href='./transaction-confirm.html?id=${transaction.id}'>
      <div class="transaction__container">
        <div class="transaction__status" style="background-color:${color}">
          <p class="ellipsis">${status}</p>
        </div>
        <div class="transaction__userinfo">
          ${info}
        </div>
        <div class="transaction__info">
          <p>Thời gian: ${formatTime(transaction.createTime)}</p>
        </div>
      </div>
    </a>`;
}
