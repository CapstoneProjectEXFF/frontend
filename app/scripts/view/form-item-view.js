/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */
let categoryLoaded = false;
let urls = [];
let removedUrls = [];
let removedImageId = [];
let images = [];
$(document).ready(() => {
  let urlParams = new URLSearchParams(window.location.search);
  getCategory(getCategorySuccess);
  if (urlParams.has("id")) {
    let id = urlParams.get("id");
    getItemTimeOut(id);
  }
  initForm();
});
function getItemTimeOut(id) {
  if (categoryLoaded) {
    getItem(
      id,
      getItemSuccess,
      getItemFalse
    );
  } else {
    setTimeout(getItemTimeOut, 50, id);
  }
}
function getItemSuccess(data) {
  const id = $("#id");
  const category = $("#category");
  const name = $("#name");
  const description = $("#description");
  const address = $("#address");
  const privacy = $("#privacy");
  id.val(data.id);
  category.val(data.category.id);
  name.val(data.name);
  description.val(data.description);
  address.val(data.address);
  privacy.val(`${data.privacy}`);
  images = data.images;
  if (images != null && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      showOldImage(images[i]);
    }
  }
}
function getItemFalse(err) {
  // console.log(err);
  window.location.href("./error404.html");
}

function initForm() {
  $("#btnEditItem").click(() => {
    if (validate()) {
      let id = $("#id").val();
      let category = $("#category").val();
      let name = $("#name").val();
      let description = $("#description").val();
      let address = $("#address").val();
      let privacy = $("#privacy").val();
      if (id == null || id == undefined || id == "") {
        addItem(
          category,
          name,
          description,
          address,
          privacy,
          urls,
          addItemSuccess,
          addItemFails
        );
      } else {
        updateItem(
          id,
          category,
          name,
          description,
          address,
          privacy,
          urls,
          removedImageId,
          updateItemSuccess,
          addItemFails
        );
      }
    }
  });
  $("#category").change(() => {
    checkRequire("#category");
  });
  $("#name").focusout(() => {
    checkRequire("#name");
  });
  $("#description").focusout(() => {
    checkRequire("#description");
  });
  $("#address").focusout(() => {
    checkRequire("#address");
  });
  $("#image").change(uploadImage);
}

function validate() {
  return checkRequire("#category")
    && checkRequire("#name")
    && checkRequire("#description")
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

function addItemSuccess(data) {
  // console.log(data);
  window.location.replace(`./item.html?id=${data.id}`);
}

function updateItemSuccess(data) {
  removedUrls.forEach(url => {
    deleteUploadedImageOnFirebase(url);
  });
  window.location.replace(`./item.html?id=${data.id}`);
}

function addItemFails(err) {
  $("#errorNotif").show();
}
function getCategorySuccess(data) {
  // console.log(data);
  let options = "";
  let groupOption = "";
  const selectTag = $("#category");
  selectTag.html('<option hidden disabled selected>Chọn loại đồ dùng</option>');
  let superCate = data.filter(category => category.supercategoryId === null);
  superCate.forEach(superCategory => {
    groupOption = $("<optgroup/>", {
      label: superCategory.name
    });
    let subCate = data.filter(category => category.supercategoryId === superCategory.id);
    subCate.forEach(subCategory => {
      let option = $("<option/>");
      option.text(subCategory.name);
      option.val(subCategory.id);
      groupOption.append(option);
    });
    selectTag.append(groupOption);
  });
  categoryLoaded = true;
}
function uploadImage(event) {
  const files = event.target.files;
  const imageUploaded = $('#imageUploaded');
  for (var i = 0; i < files.length; i++) {
    let file = files[i];
    uploadImageToFirebase(file, showImage);
  }
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
