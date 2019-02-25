function checkRequire(tagId) {
  let tag = $(tagId);
  let val = tag.val();
  if (val === undefined || val === null || val.length === 0) {
    tag.addClass('unvalidate');
    tag.next().show();
    return false;
  } else {
    tag.removeClass('unvalidate');
    tag.next().hide();
    return true;
  }
}

function checkRegex(tagId, regex) {
  let tag = $(tagId);
  let val = tag.val();
  if (!regex.test(val)) {
    tag.addClass('unvalidate');
    tag.next().show();
    return false;
  } else {
    tag.removeClass('unvalidate');
    tag.next().hide();
    return true;
  }
}

function checkMatch(tagId, baseValue) {
  let tag = $(tagId);
  let val = tag.val();
  if (val !== baseValue) {
    tag.addClass('unvalidate');
    tag.next().show();
    return false;
  } else {
    tag.removeClass('unvalidate');
    tag.next().hide();
    return true;
  }
}
