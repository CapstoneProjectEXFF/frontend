function closeModal(tagId) {
  $("#" + tagId).remove();
}
function hideModal(tagId) {
  $("#" + tagId).hide();
}
function showModal(tagId) {
  $("#" + tagId).show();
}
function renderButton(data) {
  const { className, value, handle } = data;
  return `
    <button class="${className} float-right" onclick="${handle}">${value}</button>
  `;
}
function renderAction(action) {
  if (action.length > 0) {
    let buttons = '';
    action.forEach(btn => {
      buttons += renderButton(btn);
    });
    return `
      <hr class="gray no--margin">
      <div class="modal__action clearfix">
        ${buttons}
      </div>
    `;
  }
  return '';
}
function renderModal(modal = {}) {
  const { id = 0, title, content = '', contentId = 'content', action = [] } = modal;
  return `
    <div class="modal__container" id="modal${id}">
      <div class="modal__close" onclick="closeModal('modal${id}')"></div>
      <div class="modal center">
        <div class="modal__title clearfix">
          <h3 class="float-left">${title}</h3>
          <h3 class="float-right" onclick="closeModal('modal${id}')">
            <i class="fas fa-times"></i>
          </h3>
        </div>
        <hr class="gray no--margin">
        <div class="modal__content" id="${contentId}">
          ${content}
        </div>
        ${renderAction(action)}
      </div>
    </div>
  `;
}
