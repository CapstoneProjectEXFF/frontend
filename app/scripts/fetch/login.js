const LOGIN_URL = '/login';
const ADMIN_LOGIN_URL = '/adminLogin';
const DEFAULT_FUNCTION = () => {};

//Login
function login(
  phoneNumber,
  password,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + LOGIN_URL;
  let data = {
    'phoneNumber': phoneNumber,
    'password': password
  };
  let options = {
    method: 'POST',
    body: JSON.stringify(data),
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
      const json = responseJson;
      localStorage.setItem("EXFF_TOKEN", json.Authorization);
      localStorage.setItem("ID", json.User.id);
      localStorage.setItem("USER_INFO", JSON.stringify(json.User));
      successCallback(responseJson);
    })
    .catch(err => {
      failCallback(err);
    });
}

function loginAdmin(
  username,
  password,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + ADMIN_LOGIN_URL;
  let data = {
    'username': username,
    'password': password
  };
  let options = {
    method: 'POST',
    body: JSON.stringify(data),
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
      const json = responseJson;
      localStorage.setItem("EXFF_TOKEN", json.Authorization);
      localStorage.setItem("ID", json.User.id);
      localStorage.setItem("USER_INFO", JSON.stringify(json.User));
      successCallback(responseJson);
    })
    .catch(err => {
      failCallback(err);
    });
}
