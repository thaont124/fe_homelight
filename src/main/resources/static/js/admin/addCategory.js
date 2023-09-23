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
      clickcheckbox();
      // removeNameCategory();
    }
  }
  xhttp.open("GET", domain + "/api/v1.0/Categories", true);
  xhttp.send();
}
function AllCate(Category, element) {
  for (var i = 0; i < Category.length; i++) {
    if (Category[i]['children'].length != 0) {
      element.innerHTML += '<li class="folder"><div class="folder-toggle"><i class="fas fa-chevron-circle-down"></i>' +
        '<span>' + Category[i]['categoryName'] + '</span><input type="checkbox" class="tree__checkbox" value="' + Category[i].id + '" onclick="selectname(\'' + Category[i].categoryName + '\')"></div><ul class="subfolders"></ul></li>';
      AllCate(Category[i]['children'], element.children[i].children[1]);
    } else {
      element.innerHTML += '<li class="file"><i class="fa-solid fa-caret-up"></i><span>' + Category[i]['categoryName'] + '</span><input type="checkbox" class="tree__checkbox" value="' + Category[i].id + '" onclick="selectname(\'' + Category[i].categoryName + '\')"></li>';
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
function clickcheckbox() {
  const checkboxes = document.querySelectorAll(".tree__checkbox");
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("click", function () {
      resetCheckboxes();

      if (checkbox.checked) {
        checkbox.classList.add("selected");
        // var s= document.getElementById("namecateParent")
        // s+='Thể loại cha : '+checkbox.value;
        // s.innerHTML;
        // console.log(s)
      }
    });
  });
}
function selectname(name) {
  var s = document.getElementById("namecateParent")

  s.innerHTML = 'Thể loại cha : ' + name;
  console.log(s)
}

function resetCheckboxes() {
  const selectedCheckboxes = document.querySelectorAll(".tree__checkbox.selected");
  selectedCheckboxes.forEach(function (checkbox) {
    checkbox.classList.remove("selected");
    checkbox.checked = false;
  });
}
// function removeNameCategory(){
//   const selectedCheckboxes = document.querySelectorAll(".tree__checkbox");
//   selectedCheckboxes.addEventListener("click", function(){

//     var s=document.getElementById("namecateParent")
//     s.innerHTML='Thể loại cha : ';
//   })
// }

// ... Rest of your code ...
function CheckParent() {
  // var categoryParent = document.querySelector(".tree__checkbox.selected").value;
  var categoryParent
  if (document.querySelector(".tree__checkbox.selected")) {
    categoryParent = document.querySelector(".tree__checkbox.selected").value;
    console.log(categoryParent)
    SaveCategory(categoryParent);
  }
  else {
    s = document.getElementById("error-message");
    s1 = 'Vui lòng chọn thể loại cha.';
    s.innerHTML = s1;
  }
}
function SaveCategory(categoryParent) {
  // ... Your existing code ...
  const xhttp = new XMLHttpRequest();
  var categoryName = document.getElementById("nameCategory").value;
  xhttp.onload = function () {
    console.log(xhttp.response)
    var a = xhttp.response;
    var b = JSON.parse(a);
    console.log(b)
    if (xhttp.status == 403) {
      // Xử lý khi không có quyền lấy thông tin của Categories
    }
    if (xhttp.status == 400) {
      if (b.messages == 'Categoryname is exits') {
        s = document.getElementById("error-message");
        s1 = 'Tên thể loại đã tồn tại.';
        s.innerHTML = s1;
      } else {
        s = document.getElementById("error-message");
        s1 = 'Vui lòng nhập tên thể loại.';
        s.innerHTML = s1;
      }
    }
    if (xhttp.status == 201) {
      alert("Đã lưu thành công!")
      window.location='/fe/category/viewAll'
    }
  }
  const cate = {
    categoryName: categoryName,
    parent: categoryParent
  }
  category = JSON.stringify(cate)
  xhttp.open("POST", domain + "/api/v1.0/Categories", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  token = localStorage.getItem("Token");
  authorization = 'Bearer ' + token;
  xhttp.setRequestHeader("Authorization", authorization);
  xhttp.send(category);
}
function hideErrorOnFocus() {
  const nameCategoryInput = document.getElementById("nameCategory");

  const messageError = document.getElementById("error-message");

  nameCategoryInput.addEventListener("focus", function () {
    messageError.innerHTML = ""; // Ẩn lỗi khi focus vào input
  });
}

// Gọi hàm hideErrorOnFocus() sau khi tải xong trang
window.addEventListener("load", function () {
  hideErrorOnFocus();
});
document.addEventListener("DOMContentLoaded", function () {
  const showModalButton = document.getElementById("showModal");
  const closeModalButton = document.getElementById("closeModal");
  const confirmModalButton = document.getElementById("confirm");
  const overlay = document.getElementById("overlay");
  const modal = document.getElementById("modal");

  showModalButton.addEventListener("click", function () {
    overlay.style.display = "block";
    modal.style.display = "block";
  });

  closeModalButton.addEventListener("click", function () {
    overlay.style.display = "none";
    modal.style.display = "none";
  });
  confirmModalButton.addEventListener("click", function () {
    overlay.style.display = "none";
    modal.style.display = "none";
  });
});


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

