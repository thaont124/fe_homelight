document.addEventListener("DOMContentLoaded", function () {
  const inputElement = document.getElementById("productSearch");
  inputElement.addEventListener("change", function (event) {
      const inputValue = event.target.value;
      if (inputValue.trim() != '') {
          window.location = "/fe/product/search/" + inputValue
      }
  });
});

function Orders() {

  var trangthai = document.getElementById("status").value;
  var From = document.getElementById("from").value;
  var To = document.getElementById("to").value;
  console.log(trangthai)
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {

    if (xhttp.status == 403) {
      // Xử lý khi không có quyền lấy thông tin của Categories
    }
    var OrdersJson = xhttp.responseText;
    var orders = JSON.parse(OrdersJson);

    if (xhttp.status == 200) {

      var order = document.getElementById("orders");
      var s = '';
      var s1 = '';
      console.log(orders)
      for (var i = 0; i < orders.length; i++) {
        if (orders[i].status == "Đang Giao Hàng") {
          
          var pro = '';
          for (var j = 0; j < orders[i].products.length; j++) {
            var variant = '';
            var choiceLen = orders[i].products[j].variantsDTO.choices.length
            for (var k = 0; k < choiceLen-1; k++){
              variant += orders[i].products[j].variantsDTO.choices[k].choiceValue + " - "
            }
            variant += orders[i].products[j].variantsDTO.choices[choiceLen-1].choiceValue 
            pro += '<li>Sản phẩm: ' + orders[i].products[j].productName + ', Lựa chọn: ' + variant + ', Quantity: ' + orders[i].products[j].quantity + '</li>'
          }
          s += '<tr>'
            + '<td>' + orders[i].id + '</td>'
            + '<td>' + orders[i].email + '</td>'
            + '<td>' + orders[i].phone + '</td>'
            + '<td>' + orders[i].arrived + '</td>'
            + '<td>'
            + '<ul>'
            + pro
            + '</ul>'
            + '</td>'
            + '<td>'
            + '<input type="checkbox" class="choose-status" value="' + orders[i].id + '" onclick=confirm(' + orders[i].id + ')>'
            + '</td>'
            + '</tr>'
        }
        else {
          var pro = '';
          for (var j = 0; j < orders[i].products.length; j++) {
            var variant = '';
            var choiceLen = orders[i].products[j].variantsDTO.choices.length
            for (var k = 0; k < choiceLen-1; k++){
              variant += orders[i].products[j].variantsDTO.choices[k].choiceValue + " - "
            }
            variant += orders[i].products[j].variantsDTO.choices[choiceLen-1].choiceValue 
            pro += '<li>Sản phẩm: ' + orders[i].products[j].productName + ', Lựa chọn: ' + variant + ', Quantity: ' + orders[i].products[j].quantity + '</li>'
          }
          s1 += '<tr>'
            + '<td>' + orders[i].id + '</td>'
            + '<td>' + orders[i].email + '</td>'
            + '<td>' + orders[i].phone + '</td>'
            + '<td>' + orders[i].arrived + '</td>'
            + '<td>'
            + '<ul>'
            + pro
            + '</ul>'
            + '</td>'
            + '<td>'
            + '<span>Done</span>'
            + '</td>'
            + '</tr>'
        }
      }

      if (trangthai == 0) {

        console.log(s);
        order.innerHTML = s;
      }
      else {

        console.log(s1);
        order.innerHTML = s1;

      }

    }
  }
  xhttp.open("GET", domain + "/api/v1.0/Orders?fromDate=" + From + "T00:00:00&toDate=" + To + "T23:59:59", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  token = localStorage.getItem("Token");
  authorization = 'Bearer ' + token;
  xhttp.setRequestHeader("Authorization", authorization);
  xhttp.send();
}

function confirm(id) {
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
    Complete(id);

  });
}

function Complete(id) {

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (xhttp.status == 403) {
      // document.getElementById('TableUsers').innerHTML='<h1>bạn không có quyền lấy thông tin của Categories<h1>';
    }

    if (xhttp.status == 200) {
      alert("Xác nhận đơn hàng thành công!")
      window.location = '/fe/order/viewAll'
    }

  }
  xhttp.open("PATCH", domain + "/api/v1.0/changeOrderStatus/" + id, false);
  // token = localStorage.getItem("Token");
  // authorization ='Bearer '+token;
  // xhttp.setRequestHeader("Authorization",authorization);
  xhttp.setRequestHeader("Content-type", "application/json");
  token = localStorage.getItem("Token");
  authorization = 'Bearer ' + token;
  xhttp.setRequestHeader("Authorization", authorization);
  xhttp.send();
}


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