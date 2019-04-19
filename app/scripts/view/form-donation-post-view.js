/* eslint-disable eqeqeq */
/* eslint-disable handle-callback-err */
/* eslint-disable no-use-before-define */
let urls = [];
let removedUrls = [];
let removedImageId = [];
let images = [];
let targets = [];
let removeTargets = [];
let categories = [];
let tmpTargets = [];
let tmpRemoveTargets = [];
$(document).ready(() => {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("id")) {
    let id = urlParams.get("id");
    getDonationPost(
      id,
      getDonationPostSuccess,
      getDonationPostFalse
    );
  } else {
    getCategory(getCategorySuccess);
  }
  initForm();
});
function getDonationPostSuccess(data) {
  getCategory(getCategorySuccess);
  const id = $("#id");
  const title = $("#title");
  const content = $("#content");
  const address = $("#address");
  id.val(data.id);
  title.val(data.title);
  content.val(data.content);
  address.val(data.address);
  images = data.images;
  targets = data.targets;
  if (images != null && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      showOldImage(images[i]);
    }
  }
}
function getDonationPostFalse(err) {
  window.location.href("./error404.html");
}

function getCategorySuccess(data) {
  categories = data.filter(category => category.supercategoryId !== null);
  categories.forEach(category => {
    let target = targets.find(t => t.categoryId == category.id);
    if (target != undefined) {
      category.target = target.target;
    } else {
      category.target = 0;
    }
  });
  $('#setTarget').append(renderSetDonationTargetTable(categories));
  initTarget();
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
  $('#btnAddTarget').click(() => {
    tmpTargets = targets.map(t => t.categoryId);
    tmpRemoveTargets = [];
    $('#modal').show();
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

function checkTarget(id) {
  const tagId = "targetCheck" + id;
  let checkbox = $(`#${tagId} input[type=checkbox]`);
  if (!checkbox.is(":checked")) {
    checkbox.prop('checked', true);
    $(`#${tagId} input[type=number]`).show();
    if ($(`#${tagId} input[type=number]`).val() == 0) {
      $(`#${tagId} input[type=number]`).val(10);
    }
    $(`#${tagId} span`).html('<i class="fas fa-check-square"></i>');
    tmpTargets.push(id);
    tmpRemoveTargets = tmpRemoveTargets.filter(rmId => rmId != id);
  } else {
    checkbox.prop('checked', false);
    $(`#${tagId} input[type=number]`).hide();
    $(`#${tagId} input[type=number]`).val(0);
    $(`#${tagId} span`).html('<i class="far fa-square"></i>');
    tmpTargets = tmpTargets.filter(t => t != id);
    tmpRemoveTargets.push(id);
  }
}

function confirmSetTarget() {
  tmpTargets.forEach(tmpTarget => {
    const tagId = "targetCheck" + tmpTarget;
    const value = $(`#${tagId} input[type=number]`).val();
    let target = targets.find(t => t.categoryId == tmpTarget);
    if (target == undefined) {
      targets.push({
        categoryId: tmpTarget,
        target: value
      });
    } else {
      target.target = value;
    }
  });
  tmpRemoveTargets.forEach(tmpRemoveTarget => {
    let target = targets.find(t => t.categoryId == tmpRemoveTarget);

    if (target != undefined && target.id != undefined && target.id != null) {
      removeTargets.push(target.id);
      targets = targets.filter(t => t.id != target.id);
    } else if (target != undefined) {
      targets = targets.filter(t => t.categoryId != tmpRemoveTarget);
    }
  });
  initTarget();
  hideModal('modal');
}

function cancelSetTarget() {
  tmpTargets = [];
  tmpRemoveTargets = [];
  hideModal('modal');
}

function initTarget() {
  const tag = $('#targetList');
  tag.html('');
  if (targets.length === 0) {
    tag.html('<p style="text-align: center">Không đặt mục tiêu</p>');
  } else {
    targets.forEach(target => {
      let category = categories.find(cate => cate.id == target.categoryId);
      tag.append(`
      <div class="flex flex_justify__space_between donation_post__input_target">
        <p class="ellipsis">${category.name}</p>
        <p class="ellipsis">${target.target}</p>
      </div>
      `);
    });
  }
}

