const API_URL = 'http://localhost:8080';
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

function getAuthentoken() {
  return localStorage.getItem('EXFF_TOKEN');
}
function getUserId() {
  return localStorage.getItem('ID');
}
function getUserInfo() {
  return JSON.parse(localStorage.getItem('USER_INFO'));
}
