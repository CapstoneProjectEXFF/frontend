// const CATEGORY_URL = '/category';

// function getCategory(
//   successCallback = DEFAULT_FUNCTION,
//   failCallback = DEFAULT_FUNCTION
// ) {
//   let url = API_URL + CATEGORY_URL;
//   let options = {
//     method: 'GET',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//     }
//   };
//   fetch(url, options)
//     .then((response) => {
//       if (!response.ok) {
//         var error = new Error(response.statusText);
//         error.response = response;
//         throw error;
//       }
//       return response.json();
//     }).then((responseJson) => {
//       successCallback(responseJson);
//     })
//     .catch(err => {
//       failCallback(err);
//     });
// }
