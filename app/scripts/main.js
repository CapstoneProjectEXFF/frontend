const API_URL = 'http://localhost:8080';
const DEFAULT_FUNCTION = () => {};

function getAuthentoken() {
  return localStorage.getItem('EXFF_TOKEN');
}
