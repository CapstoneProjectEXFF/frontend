// const API_URL = 'http://localhost:8080';
const API_URL = 'http://192.168.137.1:8080';
const DEFAULT_FUNCTION = () => { };

function getAuthentoken() {
  return localStorage.getItem('EXFF_TOKEN');
}
function getUserId() {
  return localStorage.getItem('ID');
}
function getUserInfo() {
  return JSON.parse(localStorage.getItem('USER_INFO'));
}
