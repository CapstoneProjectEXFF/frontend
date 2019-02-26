const ITEM_URL = '/item';

function addItem(
  category,
  name,
  description,
  address,
  privacy,
  successCallback = DEFAULT_FUNCTION,
  failCallback = DEFAULT_FUNCTION
) {
  let url = API_URL + ITEM_URL;
  let data = {
    'category': category,
    'name': name,
    'description': description,
    'address': address,
    'privacy': privacy
  };
  let options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:9000',
      'Access-Control-Allow-Credentials': 'true',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': getAuthentoken()
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
      successCallback(responseJson);
    })
    .catch(err => {
      failCallback(err);
    });
}
