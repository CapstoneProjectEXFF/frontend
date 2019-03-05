var config = {
    apiKey: "AIzaSyBKVI4ALwHV-O9bdaS0GhToq_LnBwmn1G8",
    authDomain: "exff-104b8.firebaseapp.com",
    projectId: "exff-104b8",
    storageBucket: "exff-104b8.appspot.com",
};
firebase.initializeApp(config);
// var sn;
function uploadImageToFirebase(file, callback) {
    const storageService = firebase.storage();
    const storageRef = storageService.ref();
    storageRef.child(`images/${file.name}`)
        .put(file)
        .then((snapshot) => {
            // sn = snapshot;
            console.log(snapshot);
            // console.log(`${snapshot.metadata.bucket}/${snapshot.metadata.fullPath}`);
            storageRef.child(snapshot.metadata.fullPath)
                .getDownloadURL().then((url) => {
                    callback(url);
                });
        });
}