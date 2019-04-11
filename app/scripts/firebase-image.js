var config = {
  apiKey: "AIzaSyDw8xzOZW1fwIA3KESwCGmi8gaSNV5Hmcs",
  authDomain: "exff19.firebaseapp.com",
  projectId: "exff19",
  storageBucket: "exff19.appspot.com"
};

firebase.initializeApp(config);

function uploadImageToFirebase(file, callback) {
  const storageService = firebase.storage();
  const storageRef = storageService.ref();
  storageRef.child(`images/${getUserId()}${new Date().getTime()}${file.name}`)
    .put(file)
    .then((snapshot) => {
      storageRef.child(snapshot.metadata.fullPath)
        .getDownloadURL().then((url) => {
          callback(url);
        });
    });
}


