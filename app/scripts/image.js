function renderImage(image) {
  return `
  <div class="image position--relative">
    <div class="background" style="background-image: url(${image})"></div>
  </div>
  `;
}

function selectSlideShowImage(id, url) {
  $('.slide_show__image__container .slide_show__image_list .slide_show__image_list__image').removeClass('selected');
  $('.slide_show__image__container .slide_show__image_list #image' + id).addClass('selected');
  $('.slide_show__image__container .slide_show__image img').attr('src', url);
}

function renderSlideShowImageList(images) {
  let res = '';
  images.forEach((image, index) => {
    let selected = (index === 0) ? 'selected' : '';
    res += `
    <div class="slide_show__image_list__image ${selected}" id="image${index}" onclick="selectSlideShowImage('${index}','${image.url}')">
      <img src="${image.url}" alt="">
    </div>
    `;
  });
  return res;
}

function renderSlideShow(images) {
  let res, slideShowImageList, slideShowImage;
  slideShowImageList = renderSlideShowImageList(images);
  slideShowImage = (images !== undefined && images.length > 0) ? images[0].url : '';
  res = `
  <div class="slide_show__image__container flex">
    <div class="slide_show__image_list">
      ${slideShowImageList}
    </div>
    <div class="slide_show__image flex_grow__1">
      <img src="${slideShowImage}" alt="">
    </div>
  </div>
  `;
  return res;
}

