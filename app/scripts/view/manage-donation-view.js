/* eslint-disable new-cap */
/* eslint-disable handle-callback-err */
/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
let datatable;
$(document).ready(() => {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("id")) {
    let id = urlParams.get("id");
    let p1 = new Promise((resolve, reject) => {
      getDonationPost(
        id,
        (data) => {
          getDonationPostSuccess(data);
          resolve(data);
        },
        getDonationPostFalse
      );
    });
    let p2 = new Promise((resolve, reject) => {
      getDonatorOfDonationPost(
        id,
        (data) => {
          getDonatorSuccess(data);
          resolve(data);
        },
        getDonatorFalse
      );
    });
    Promise.all([p1, p2]).then((value) => {
      getCategoryCount(value[1], value[0].targets);
    });
    initDataTable();
  } else {
    window.location.replace("./error404.html");
  }
});
function initDonationPostView(data) {
  const date = $("#date");
  const address = $("#address");
  const postTitle = $("#postTitle");

  let time = formatTime(data.createTime);

  date.text(time);
  address.text(data.address);
  postTitle.text(data.title);
}
function initDataTable() {
  datatable = $('#donatorTable').DataTable({
    "columnDefs": [
      {
        "targets": [1],
        "visible": false,
        "searchable": false
      }
    ],
    language: {
      processing: "Đang xử lý...",
      search: "Tìm kiếm&nbsp;:",
      lengthMenu: "Xem _MENU_ mục",
      info: "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ mục",
      infoEmpty: "Đang xem 0 đến 0 trong tổng số 0 mục",
      infoFiltered: "(được lọc từ _MAX_ mục)",
      infoPostFix: "",
      loadingRecords: "Đang tải...",
      zeroRecords: "Không tìm thấy dòng nào phù hợp",
      emptyTable: "Chưa có người quyên góp",
      paginate: {
        first: "Đầu",
        previous: "Trước",
        next: "Tiếp",
        last: "Cuối"
      }
    }
  });
  $('#donatorTable tbody').on('click', 'tr', function () {
    let data = datatable.row(this).data();
    let url = `./transaction-confirm.html?id=${data[1]}`;
    window.open(url, '_blank');
  });
}

function initTarget(data) {
  const targetTag = $('#target');
  const targets = data.targets;
  // targetValueMax = targets;
  if (targets.length == 0) {
    $('#target').html('');
    $('#target').hide();
  } else {
    targetTag.html(renderTarget(targets));
  }
}
function getDonationPostSuccess(data) {
  initDonationPostView(data);
  initTarget(data);
}
function getDonationPostFalse(err) {
  // console.log(err);
  window.location.href = ("./error404.html");
}

function getDonatorSuccess(data) {
  const donatorNum = $('#donatorNum');
  // getCategoryCount(data);
  // console.log(data);
  loadDonatorToTable(data);
  donatorNum.html(`${numeral(data.length).format('0,0')} `);
}
function loadDonatorToTable(data) {
  const userData = data.map((elem, index) => {
    const { transaction, details } = elem;
    const { id, sender, modifyTime, status } = transaction;
    let statusStr = (status == TRANSACTION_DONATE)
      ? 'Chưa nhận'
      : (transaction.status == TRANSACTION_DONE)
        ? 'Hoàn thành'
        : 'Chưa chuyển đồ';
    return [index + 1, id, sender.fullName, sender.phoneNumber, formatTime(modifyTime), statusStr];
  });
  datatable.clear().draw();
  datatable.rows.add(userData);
  datatable.columns.adjust().draw();
}
function getDonatorFalse(err) {
  console.log(err);
  // window.location.href = ("./error404.html");
}

function getCategoryCount(data, donationTarget) {
  if (donationTarget.length <= 0) {
    return;
  }
  let transactions = data;
  let tracsactionsCategory = transactions.map((elem) => {
    let { details } = elem;
    let tmpDetails = details.map(i => i.item.category.id);
    return tmpDetails;
  });
  let res = [];
  tracsactionsCategory.forEach(element => {
    res = res.concat(element);
  });

  let targetValue = res.reduce((accumulator, current) => {
    accumulator['' + current] = (accumulator[current] || 0) + 1;
    return accumulator;
  }, {});
  let targetValueMax = getMaxTarget(donationTarget);
  targetValue = Object.entries(targetValue);
  targetValue.forEach(([categoryId, value]) => {
    let tag = $(`#targetProcess${categoryId}`);
    let tagValue = $(`#targetProcessValue${categoryId}`);
    if (targetValueMax[categoryId] != undefined) {
      if (targetValueMax[categoryId] <= 0) {
        tag.animate({ width: '100%' }, 500);
      } else {
        let percent = value / targetValueMax[categoryId] * 100;
        tag.animate({ width: percent + '%' }, 500);
        tagValue.text(`${value}/${targetValueMax[categoryId]}`);
      }
    }
  });
}

function getMaxTarget(donationTarget) {
  return donationTarget.reduce((accumulator, current) => {
    let { categoryId, target } = current;
    accumulator['' + categoryId] = target;
    return accumulator;
  }, {});
}

function renderTarget(targets) {
  let targetTagList = '';
  targets.forEach(target => {
    let value = (target.target > 0) ? `0/${target.target}` : 'Không giới hạn';
    targetTagList += `
    <p>${target.category.name}: <span id="targetProcessValue${target.category.id}">${value}</span></p>
    <div class="progress" style="height:1.2em">
      <div class="progress-bar primary" style="width:0%;" id="targetProcess${target.category.id}"></div>
    </div>
    `;
  });
  return `
    <h3>Mục tiêu:</h3>
    ${targetTagList}
  `;
}
