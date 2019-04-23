const ADMIN_USER_URL = '/admin/user';

function getUsers(
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + ADMIN_USER_URL;
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

function getBanUsers(
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + ADMIN_USER_URL + '?status=0';
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
