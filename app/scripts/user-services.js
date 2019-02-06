const LOGIN_URL = '/login';
const REGISTER_URL = '/register';

//login
//backUrl: go to this after login successful
function login(phoneNumber, password, backUrl = "") {
  'use strict';
  let data = {
    'phoneNumber': phoneNumber,
    'password': password
  };
  fetch(API_URL + LOGIN_URL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    if (response.ok) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      // Read the response as json.
      return response.json();
    }
  }).then((responseAsJson) => {
    const json = responseAsJson;
    localStorage.setItem('EXFF_TOKEN', json.Authorization);
    console.log(json);
  }).catch((err) => {
    console.log(err);
  });
}

//register
function register(phoneNumber, password) {
  'use strict';
  let data = {
    'phoneNumber': phoneNumber,
    'password': password
  };
  fetch(API_URL + REGISTER_URL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    if (response.ok) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      // Read the response as json.
      return response.json();
    }
  }).then((responseAsJson) => {
    const json = responseAsJson;
    localStorage.setItem('EXFF_TOKEN', json.Authorization);
    console.log(json);
  }).catch((err) => {
    console.log(err);
  });
}
