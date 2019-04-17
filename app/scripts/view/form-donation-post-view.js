/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */
let urls = [];
let removedUrls = [];
let removedImageId = [];
let images = [];
let targets = [];
let removeTargets = [];
$(document).ready(() => {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("id")) {
    let id = urlParams.get("id");
    getDonationPost(
      id,
      getDonationPostSuccess,
      getDonationPostFalse
    );
  }
  initForm();
});
function getDonationPostSuccess(data) {
  const id = $("#id");
  const title = $("#title");
  const content = $("#content");
  const address = $("#address");
  id.val(data.id);
  title.val(data.title);
  content.val(data.content);
  address.val(data.address);
  images = data.images;
  if (images != null && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      showOldImage(images[i]);
    }
  }
}
function getDonationPostFalse(err) {
  // console.log(err);
  window.location.href("./error404.html");
}

function initForm() {
  $("#btnEditDonationPost").click(() => {
    if (validate()) {
      let id = $("#id").val();
      let title = $("#title").val();
      let content = $("#content").val();
      let address = $("#address").val();
      if (id == null || id == undefined || id == "") {
        addDonationPost(
          title,
          content,
          address,
          urls,
          targets,
          addDonationPostSuccess,
          addDonationPostFails
        );
      } else {
        updateDonationPost(
          id,
          title,
          content,
          address,
          urls,
          removedImageId,
          targets,
          removeTargets,
          updateDonationPostSuccess,
          addDonationPostFails
        );
      }
    }
  });
  $("#title").focusout(() => {
    checkRequire("#title");
  });
  $("#content").focusout(() => {
    checkRequire("#content");
  });
  $("#address").focusout(() => {
    checkRequire("#address");
  });
  $("#image").change(uploadImage);

  $('textarea').keydown(autosize);

}

function validate() {
  return checkRequire("#title")
    && checkRequire("#content")
    && checkRequire("#address")
    && checkImage();
}

function checkImage() {
  let res = $('#imageUploaded .image .background').length > 0;
  if (!res) {
    $('.item__form__image .error').removeClass('hidden');
  } else {
    $('.item__form__image .error').addClass('hidden');
  }
  return res;
}
function autosize() {
  let el = $(this);
  setTimeout(function () {
    el.css('height', 'auto');
    el.css('height', el.prop("scrollHeight") + 'px');
    // el.style.cssText = 'height:' + el.scrollHeight + 'px';
  }, 0);
}
function addDonationPostSuccess(data) {
  // console.log(data);
  window.location.replace(`./donation-post.html?id=${data.id}`);
}

function updateDonationPostSuccess(data) {
  // console.log(data);
  removedUrls.forEach(url => {
    deleteUploadedImageOnFirebase(url);
  });
  window.location.replace(`./donation-post.html?id=${data.id}`);
}

function addDonationPostFails(err) {
  $("#errorNotif").show();
}
function uploadImage(event) {
  const files = event.target.files;
  const imageUploaded = $('#imageUploaded');
  for (var i = 0; i < files.length; i++) {
    let file = files[i];
    uploadImageToFirebase(file, showImage);
  }
  // uploadImageToFirebase(file, showImage);
}
function showImage(url) {
  const imageUploaded = $('#imageUploaded');
  urls.push(url);
  imageUploaded.append(renderInputImage(url, urls.indexOf(url)));
}
function showOldImage(image) {
  const imageUploaded = $('#imageUploaded');
  imageUploaded.append(renderInputOldImage(image.url, image.id));
}
function deleteImage(url, id) {
  deleteUploadedImageOnFirebase(
    url,
    () => {
      $(`#image${id}`).remove();
      urls = urls.filter(u => u != url);
    }
  );
}
function deleteOldImage(url, id) {
  removedImageId.push(id);
  removedUrls.push(url);
  $(`#oldImage${id}`).remove();
}
