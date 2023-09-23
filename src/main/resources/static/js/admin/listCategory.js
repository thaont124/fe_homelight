// ... Các phần khác của mã ...

document.addEventListener("DOMContentLoaded", function () {
  getCategories();
});

function getCategories() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (xhttp.status == 403) {
      // Xử lý khi không có quyền lấy thông tin của Categories
    }
    var categoryJsons = xhttp.responseText;
    var categories = JSON.parse(categoryJsons);
    if (xhttp.status == 200) {
      const addtree = document.getElementById('addtree');
      AllCate(categories, addtree);

      // Gắn lại sự kiện đóng/mở cây và chỉ chọn 1 ô checkbox sau khi thêm dữ liệu
      addTreeEventListeners();
    }
  }
  xhttp.open("GET", domain + "/api/v1.0/Categories", true);
  xhttp.send();
}
function AllCate(Category, element) {
  for (var i = 0; i < Category.length; i++) {
    if (Category[i]['children'].length != 0) {
      element.innerHTML += '<li class="folder"><div class="folder-toggle"><i class="fas fa-chevron-circle-down"></i>' +
        '<span class="category-name">' + Category[i]['categoryName'] + '</span><input type="text" class="category-input" value="' + Category[i]['categoryName'] + '" style="display: none;">' +
        '<i class="fa-regular fa-pen-to-square" onclick="toggleEditInput(this,' + Category[i].id + ')"></i>' +
        '<i class="fa-solid fa-trash-can" onclick="confirmdelete(' + Category[i].id + ')"></i></div>' +
        '<ul class="subfolders"></ul></li>';
      AllCate(Category[i]['children'], element.children[i].children[1]);
    } else {
      element.innerHTML += '<li class="file"><span class="category-name">' + Category[i]['categoryName'] + '</span><input type="text" class="category-input" value="' + Category[i]['categoryName'] + '" style="display: none;">' +
        '<i class="fa-regular fa-pen-to-square" onclick="toggleEditInput(this,' + Category[i].id + ')"></i>' +
        '<i class="fa-solid fa-trash-can" onclick="confirmdelete(' + Category[i].id + ')"></i></li>';
    }
  }
}
function addTreeEventListeners() {
  const folderToggles = document.querySelectorAll(".folder-toggle");
  folderToggles.forEach(function (toggle) {
    const chevronIcon = toggle.querySelector(".fas.fa-chevron-circle-down");
    chevronIcon.addEventListener("click", function () {
      toggle.classList.toggle("open");
    });
  });
}

// Hàm để chuyển đổi giữa thẻ <span> và <input>
function toggleEditInput(icon, id) {
  const listItem = icon.closest("li"); // Phần tử cha là <li>
  const spanElement = listItem.querySelector(".category-name");
  const inputElement = listItem.querySelector(".category-input");

  spanElement.style.display = "none";
  inputElement.style.display = "inline";
  inputElement.focus(); // Đặt focus vào ô input
  inputElement.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) { // Mã phím của Enter
      event.preventDefault(); // Ngăn không cho form submit (nếu có)
      // spanElement.textContent
      var s = inputElement.value; // Đặt giá trị mới cho thẻ <span>
      savecategory(id, s);
      inputElement.style.display = "none";
      spanElement.style.display = "inline";
    }
  })
}
function savecategory(id, s) {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (xhttp.status == 403) {
      // Xử lý khi không có quyền lấy thông tin của Categories
    }
    var categoryJsons = xhttp.responseText;
    var categories = JSON.parse(categoryJsons);
    if (xhttp.status == 400) {
      if (categories.messages == 'Categoryname is exits') {
        alert("Tên thể loại đã tồn tại.")
        window.location = "/fe/category/viewAll"

      } else {
        alert("Vui lòng nhập tên thể loại.")
        window.location = "/fe/category/viewAll"
      }
    }
    if (xhttp.status == 200) {
      alert('Đã đổi tên thành công');
      window.location = "/fe/category/viewAll"
    }
  }
  cate = {
    categoryName: s
  }
  category = JSON.stringify(cate)
  xhttp.open("PUT", domain + "/api/v1.0/Category/" + id, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  token = localStorage.getItem("Token");
  authorization = 'Bearer ' + token;
  xhttp.setRequestHeader("Authorization", authorization);
  xhttp.send(category);
}
function confirmdelete(id) {
  // var a=document.getElementById("modal")
  // var s='<h2>Thông báo</h2>'+
  // '<p>Bạn chắc chắn muốn xóa thể loại này ?</p>'
  // +'<button id="closeModal">No</button>'
  // +'<button id="confirm" onclick="deleteCategory('+id+')">Yes</button>';
  // a.innerHTML=s;
  const overlay = document.getElementById("overlay");
  const modal = document.getElementById("modal");
  overlay.style.display = "block";
  modal.style.display = "block";

  const closeModalButton = document.getElementById("closeModal");
  const confirmModalButton = document.getElementById("confirm");

  closeModalButton.addEventListener("click", function () {
    overlay.style.display = "none";
    modal.style.display = "none";
  });

  confirmModalButton.addEventListener("click", function () {

    overlay.style.display = "none";
    modal.style.display = "none";
    deleteCategory(id);

  });
}
function deleteCategory(a) {

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (xhttp.status == 403) {
      // document.getElementById('TableUsers').innerHTML='<h1>bạn không có quyền lấy thông tin của Categories<h1>';
    }

    if (xhttp.status == 204) {
      alert("đã xóa thành công!")
      window.location = '/fe/category/viewAll'
    }

  }
  xhttp.open("DELETE", domain + "/api/v1.0/Category/" + a, false);
  // token = localStorage.getItem("Token");
  // authorization ='Bearer '+token;
  // xhttp.setRequestHeader("Authorization",authorization);
  xhttp.setRequestHeader("Content-type", "application/json");
  token = localStorage.getItem("Token");
  authorization = 'Bearer ' + token;
  xhttp.setRequestHeader("Authorization", authorization);
  xhttp.send();
}

// ... Các phần khác của mã ...


/* ----------------------------------------------CHECK ADMIN---------------------------------------------- */

function CheckAdmin() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (xhttp.status == 200) {
      var ResponseJson = xhttp.responseText
      var Response = JSON.parse(ResponseJson)
      if (Response.authorities[0].authority != "ROLE_ADMIN") {
        localStorage.removeItem("Token");
        window.location = "/fe/login";
      }
    } else if (xhttp.status == 204) {

    }
    else if (xhttp.status == 401) {
      localStorage.removeItem("Token");
      window.location = "/fe/login";
    }
    else if (xhttp.status == 403) {
      localStorage.removeItem("Token");
      window.location = "/fe/login";
    }
  }

  xhttp.open("GET", `${domain}/user`, false);

  xhttp.setRequestHeader("Content-type", "application/json")
  token = localStorage.getItem("Token");
  authorization = 'Bearer ' + token
  xhttp.setRequestHeader("Authorization", authorization);
  xhttp.send();

}
if (localStorage.getItem("Token")) {
  CheckAdmin();
  init();
  viewProduct();
  checkAndToggleChoiceVisibility();
}
else {
  window.location = "/fe/login";
}