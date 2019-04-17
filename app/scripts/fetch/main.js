const API_URL = 'http://localhost:8080';
// const API_URL = 'http://35.247.191.68:8080';
const NODE_URL = 'http://35.247.191.68:3000';
// const NODE_URL = 'http://localhost:3000';
// const API_URL = 'http://172.16.1.38:8080';
// const API_URL = 'http://192.168.137.1:8080';
const DEFAULT_FUNCTION = () => { };
const USER_ENABLE = '1';
const USER_DISABLE = '0';
const ITEM_ALL = '';
const ITEM_DISABLE = '0';
const ITEM_ENABLE = '1';
const ITEM_TRADED = '2';
const DONATION_POST_DISABLE = '0';
const DONATION_POST_ENABLE = '1';
const DONATION_POST_PAUSE = '2';
const TRANSACTION_DISABLE = '0';
const TRANSACTION_SEND = '1';
const TRANSACTION_DONE = '2';
const TRANSACTION_RESEND = '4';
const RELATIONSHIP_SEND = '1';
const RELATIONSHIP_ACCEPTED = '2';
const ITEM_PRIVACY_PUBLIC = '0';
const ITEM_PRIVACY_FRIENDS = '1';
const ITEM_TYPE = '0';
const DONATION_TYPE = '1';

const USER_ACCEPTED_TRADE_MESSAGE = -1;
const USER_CANCELED_TRADE_CONFIRM_MESSAGE = -2;
const USER_RESET_TRADE_MESSAGE = -3;
const TRADE_DONE_MESSAGE = -4;
const USER_ADDED_ITEM_MESSAGE = -5;
const USER_REMOVED_ITEM_MESSAGE = -6;


// get
function getAuthentoken() {
  return localStorage.getItem('EXFF_TOKEN');
}
function getUserId() {
  return localStorage.getItem('ID');
}
function getUserInfo() {
  return JSON.parse(localStorage.getItem('USER_INFO'));
}
// checkLogin
function checkLogin() {
  if (getUserId() === undefined || getUserId() === null || getAuthentoken() === null) {
    window.location.replace("./login.html");
  }
}
function isNotLogin() {
  return (getUserId() === undefined || getUserId() === null || getAuthentoken() === null);
}
// fetch
function fetchApi(
  url,
  options,
  successCallback,
  failCallback
) {
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

// format time
moment.locale('vi');

function formatTime(time) {
  let diff = moment() - moment(time);
  if (diff < moment.duration(1, 'd')) {
    return moment(time).fromNow();
  }
  return moment(time).format('DD/MM/YYYY') + ' lúc ' + moment(time).format('hh:mm');
}

// redirect

function redirectTo404(data) {
  window.location.href = './error404.html';
}

// animation

function dropdown(tagId, tag) {
  $(tag).find('i').toggle();
  $(`#${tagId}`).slideToggle();
}
