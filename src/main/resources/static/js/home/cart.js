document.addEventListener("DOMContentLoaded", function () {
  const inputElement = document.querySelector("#search__product input");
  inputElement.addEventListener("change", function (event) {
      const inputValue = event.target.value;
      if (inputValue.trim() != '') {
          window.location = "/fe/user/productByName/" + inputValue
      }
  });

  const inputMobileElement = document.querySelector("#searchMobile__product input");
  inputMobileElement.addEventListener("change", function (event) {
      const inputValue = event.target.value;
      if (inputValue.trim() != '') {
          window.location = "/fe/user/productByName/" + inputValue
      }
  });
});



getCategories();
function getCategories() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://26.127.173.194:8080/api/v1.0/Categories", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Xử lý dữ liệu nhận được từ phản hồi
      var categoryData = JSON.parse(xhr.responseText);


      var categoryHtml = `
        <ul>
          <li>
              <a href="/fe/user/home">TRANG CHỦ</a>
          </li>
        `;
      var categoryElement = document.getElementById("contentmenuCategory");
      var categoryMobileHtml = `
        <ul>
          <li>
              <a href="/fe/user/home" class="selected">TRANG CHỦ</a>
          </li>
        `;
      var categoryMobileElement = document.getElementById("contentmenuCategoryMobile");
      for (var i = 0; i < categoryData.length; i++) {
        categoryMobileHtml += `
        <li>
          <a href="/fe/user/productByCategory/${categoryData[i]["id"]}">${categoryData[i]["categoryName"]}</a>
          </li>
        `;
        categoryHtml += "<li>";
        categoryHtml += `<a href="/fe/user/productByCategory/${categoryData[i]["id"]}">${categoryData[i]["categoryName"]}</a>`;
        if (categoryData[i]["children"]) {
          categoryHtml += `
          <div class="category__children">
              <ul>`;
          for (var j = 0; j < categoryData[i]["children"].length; j++) {
            categoryHtml += `<li>
                  <a href="/fe/user/productByCategory/${categoryData[i]["children"][j]["id"]}">
                    <i class="fa-solid fa-caret-right"></i>
                    ${categoryData[i]["children"][j]["categoryName"]}
                 </a>
                </li>`
          }
          categoryHtml += `
              </ul>
            </div>   
          `;
        }
        categoryHtml += "</li>";
      }
      categoryElement.innerHTML = categoryHtml + '</ul>';
      categoryMobileElement.innerHTML = categoryMobileHtml + '</ul>';
    } else {
      console.log("Yêu cầu không thành công. Mã lỗi:", xhr.status);
    }
  };

  xhr.onerror = function () {
    console.log("Đã xảy ra lỗi trong quá trình yêu cầu.");
  };

  xhr.send();
}
function clickChangQuantity() {
  const minusBtns = document.querySelectorAll('.minus-btn');
  const plusBtns = document.querySelectorAll('.plus-btn');
  const quantityInputs = document.querySelectorAll('input[type="number"]');

  // Xử lý sự kiện khi nhấn nút trừ
  minusBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const input = this.nextElementSibling;
      if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
      }
      TotalPrice();
    });
  });

  // Xử lý sự kiện khi nhấn nút cộng
  plusBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const input = this.previousElementSibling;
      input.value = parseInt(input.value) + 1;
      TotalPrice();
    });
  });

  // Xử lý sự kiện khi thay đổi số lượng trực tiếp trong ô nhập
  quantityInputs.forEach(input => {
    input.addEventListener('change', function () {
      if (parseInt(this.value) < 1) {
        this.value = 1;
      }
      TotalPrice();
    });
  });
};
function getProductByID(productID) {
  return new Promise(function (resole, reject) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (xhttp.status == 403) {
        // Xử lý khi không có quyền lấy thông tin của Categories
      }
      var productJson = xhttp.responseText;
      var product = JSON.parse(productJson);

      if (xhttp.status == 200) {
        resole(product);
      }


    }
    xhttp.open("GET", domain + "/api/v1.0/ProductDetail/" + productID, true);
    xhttp.send();
  });
}
GetProducts()
async function GetProducts() {
  var cart = localStorage.getItem("cart");

  const storedListOrder = JSON.parse(cart);
  console.log(storedListOrder)
  var s = document.getElementById("cart")
  var s1 = `<h1>Giỏ hàng của bạn</h1>
    <input type="checkbox" class="allproduct-checkbox" id="allproduct-checkbox">
    <span>Chọn tất cả</span>`
  for (var i = 0; i < storedListOrder.length; i++) {

    let product = await getProductByID(storedListOrder[i].idProduct);

    let k = 0;
    for (var j = 0; j < product.variantsDTO.length; j++) {

      if (product.variantsDTO[j].id == storedListOrder[i]['idVariant']) {

        k = j;
        break;
      }
    }
    var idVariant = storedListOrder[i]['idVariant']

    var oldprice = product.variantsDTO[k].originPrice
    var price = 0
    var choise = '';
    var variantsDTOLen;
    if (product.variantsDTO[k].choices){
      variantsDTOLen = product.variantsDTO[k].choices.length
      for (var j = 0; j < variantsDTOLen - 1; j++) {
        choise += '<span>' + product.variantsDTO[k].choices[j].choiceName + ': ' + product.variantsDTO[k].choices[j].choiceValue + ',    </span>'
      }
      choise += '<span>' + product.variantsDTO[k].choices[product.variantsDTO[k].choices.length - 1].choiceName + ': ' + product.variantsDTO[k].choices[product.variantsDTO[k].choices.length - 1].choiceValue + '    </span>'
    }
    else {
      variantsDTOLen = 0;

    }
    
    var image;
    for (var indexImage = 0; indexImage < product.image.length; indexImage++){
        if (product.image[indexImage].type == 'image'){
          image = product.image[indexImage];
          break;
        }
    }
    console.log(image)
    if (product.variantsDTO[k].sale.length != 0) {
      price = parseInt(oldprice) * (1 - parseInt(product.variantsDTO[k].sale[0].numberSale) / 100)
      s1 += '<div class="cart-item">'
        + '<input type="checkbox" class="product-checkbox" value="' + idVariant + '" productid="' + product.id + '" >'
        + '<img src="' + image.url + '">'
        + '<div class="product-details">'
        + '<span>' + product.productName + '</span><br>'
        + '<span class="oldprice" value="' + oldprice + '"> ₫' + oldprice + '</span>'
        + '<span class="newprice" value="' + price.toFixed(2) + '">  ₫' + price.toFixed(2) + '</span><br>'
        + choise
        + '<div class="quantity">'
        + ' <button class="minus-btn">-</button>'
        + ' <input type="number" min="1" value="' + storedListOrder[i].quantity + '">'
        + '<button class="plus-btn">+</button>'
        + '</div>'
        + '<i class="fa-solid fa-rectangle-xmark" onclick="deleteVariant(' + idVariant + ')"></i>'
        + '</div>'
        + '</div>'
    } else {
      s1 += '<div class="cart-item">'
        + '<input type="checkbox" class="product-checkbox" value="' + idVariant + '" productid="' + product.id + '" >'
        + '<img src="' + image.url + '">'
        + '<div class="product-details">'
        + '<span>' + product.productName + '</span><br>'
        + '<span class="newprice" value="' + oldprice + '">  ₫' + oldprice + '</span><br>'
        + choise
        + '<div class="quantity">'
        + ' <button class="minus-btn">-</button>'
        + ' <input type="number" min="1" value="' + storedListOrder[i].quantity + '">'
        + '<button class="plus-btn">+</button>'
        + '</div>'
        + '<i class="fa-solid fa-rectangle-xmark" onclick="deleteVariant(' + idVariant + ')"></i>'
        + '</div>'
        + '</div>'
    }

  }
  s1 += `
    <div class="cart-total" id="cart-total">
      <p>Tổng cộng: 0đ</p>
    </div>
    `;
  s.innerHTML = s1;
  clickChangQuantity();
  TotalPrice();
  ChooseProduct();
  chooseAll();
}

function chooseAll() {
  const checkAll = document.getElementById("allproduct-checkbox");
  checkAll.addEventListener("click", function () {
    const checkboxes = document.querySelectorAll(".product-checkbox");
    console.log(checkAll)
    console.log(checkboxes)
    checkboxes.forEach(function (checkbox) {
      if (checkAll.checked) {
        checkbox.checked = true;
      }
      else checkbox.checked = false;
    })
    TotalPrice();
  })
}

function ChooseProduct() {
  const checkboxes = document.querySelectorAll(".product-checkbox");
  const checkAll = document.getElementById("allproduct-checkbox");
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("click", function () {
      if (!checkbox.checked && checkAll.checked) {
        checkAll.checked = false;
      }
      TotalPrice();
    })
  })
}


function TotalPrice() {
  var cartHTML = document.getElementById("cart")
  var products = cartHTML.querySelectorAll(".cart-item")
  var sum = 0;

  products.forEach(function (productDetail) {
    const checkbox = productDetail.querySelector(".product-checkbox");
    const quantityInput = productDetail.querySelector(".product-details .quantity input")

    var price = parseInt(productDetail.querySelector(".product-details .newprice").getAttribute("value"));

    if (checkbox.checked) {

      sum += parseInt(quantityInput.value) * parseFloat(price);
    }


  })
  // alert(sum)
  var totalElement = document.getElementById("cart-total");
  var totalHtml = '<p>Tổng cộng: ' + sum.toFixed(2) + 'đ</p>';

  totalElement.innerHTML = totalHtml;
}
Order();
function Order() {

  const orderButton = document.getElementById("orderButton");
  var cart = localStorage.getItem("cart");

  const storedListOrder = JSON.parse(cart);
  orderButton.addEventListener("click", function (event) {
    event.preventDefault(); // Chặn hành vi mặc định của nút submit
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var address = document.getElementById("address").value;

    var listProduct = [];
    var cartHTML = document.getElementById("cart")
    var products = cartHTML.querySelectorAll(".cart-item")
    var sum = 0;
    products.forEach(product => {
      const checkbox = product.querySelector(".product-checkbox");
      const quantityInput = product.querySelector(".product-details .quantity input")
      var price = product.querySelector(".product-details .newprice").value;
      if (checkbox.checked) {

        listProduct.push({
          quantity: parseInt(quantityInput.value),
          productVariantId: parseInt(checkbox.value),
          id: parseInt(checkbox.getAttribute("productid"))
        })
      }

    })


    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (xhttp.status == 403) {
        // Xử lý khi không có quyền lấy thông tin của Categories
      }

      if (xhttp.status == 201) {
        alert("Đã đặt hàng thành công ")
        window.location='/fe/user/home'
        var filtered = storedListOrder.filter(item1 => {
          return !listProduct.some(item2 => item2.productVariantId === item1.idVariant);
        });
        console.log("gio", filtered)
        console.log("li", listProduct)
        const ProductList = JSON.stringify(filtered);
        localStorage.setItem("cart", ProductList);
        // window.location = '/Home'
      }
      else {
        var response = JSON.parse(xhttp.responseText)
        if (response.messages == "Please choose at least a product") {
          alert("Vui lòng chọn sản phẩm.")
        }
        else {
          if (response.messages.email == 'email is required') {
            var s = document.getElementById("eEmail");
            s.innerHTML = 'Vui lòng nhập địa chỉ email.'
          }
          if (response.messages.phone == 'phone is required') {
            var s = document.getElementById("ePhone");
            s.innerHTML = 'Vui lòng nhập số điện thoại.'
          }
          if (response.messages.arrived == 'arrived is required') {
            var s = document.getElementById("eAddress");
            s.innerHTML = 'Vui lòng nhập địa chỉ.'
          }
        }
      }
    }

    const CartJson = {
      email: email,
      phone: phone,
      arrived: address,
      productList: listProduct
    }
    console.log(CartJson)
    Cart = JSON.stringify(CartJson)
    xhttp.open("POST", domain + "/api/v1.0/Order", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(Cart);
  });

}
// Thêm sự kiện focus vào các input để ẩn thẻ <p> hiển thị lỗi
function hideErrorOnFocus() {
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");

  const emailError = document.getElementById("eEmail");
  const phoneError = document.getElementById("ePhone");
  const addressError = document.getElementById("eAddress");

  emailInput.addEventListener("focus", function () {
    emailError.innerHTML = ""; // Ẩn lỗi khi focus vào input
  });

  phoneInput.addEventListener("focus", function () {
    phoneError.innerHTML = ""; // Ẩn lỗi khi focus vào input
  });

  addressInput.addEventListener("focus", function () {
    addressError.innerHTML = ""; // Ẩn lỗi khi focus vào input
  });
}

// Gọi hàm hideErrorOnFocus() sau khi tải xong trang
window.addEventListener("load", function () {
  hideErrorOnFocus();
});

function deleteVariant(idVariant) {

  var cart = localStorage.getItem("cart");
  const storedListOrder = JSON.parse(cart);
  for (var i = 0; i < storedListOrder.length; i++) {
    if (storedListOrder[i].idVariant == idVariant) {
      storedListOrder.splice(i, 1);

    }
  }
  const ProductList = JSON.stringify(storedListOrder);
  localStorage.setItem("cart", ProductList);
  window.location = '/fe/user/cart'
}

//--------------------header__menu trượt fixed------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const menu = document.querySelector("#header .header__menu");
  const navbar = document.querySelector("#header .header__navbar");

  // Lấy vị trí của thanh menu từ phía trên thanh navbar
  const menuTopOffset = navbar.offsetTop + navbar.offsetHeight;
  handleScroll();
  // Xử lý sự kiện scroll
  function handleScroll() {
    const scrollY = window.scrollY;

    // Nếu cuộn chuột đến vị trí của thanh menu
    if (scrollY >= menuTopOffset) {
      menu.classList.add("fixed");
    } else {
      menu.classList.remove("fixed");
    }
  }
  const menuMobile = document.querySelector("#headerMobile .headerMobile__menu");
  const navbarMobile = document.querySelector("#headerMobile .headerMobile__navbar");
  console.log(menuMobile)
  // Lấy vị trí của thanh menu từ phía trên thanh navbar
  const menuTopOffsetMobile = navbarMobile.offsetTop + navbarMobile.offsetHeight;
  handleScrollMobile();
  // Xử lý sự kiện scroll
  function handleScrollMobile() {
    const scrollY = window.scrollY;
    
    // Nếu cuộn chuột đến vị trí của thanh menu
    if (scrollY >= menuTopOffsetMobile) {
      menuMobile.classList.add("fixed");
      
    } else {
      menuMobile.classList.remove("fixed");
    }
  }

  // Thêm sự kiện scroll cho cửa sổ
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("scroll", handleScrollMobile);
});


//-------------------- Thêm bớt số lượng -----------------------------------
function orderQuantity(){

  var quantityCountElement =document.getElementById("orderCountSelected__quantity");
  var subCountElement = document.getElementById("orderCountSelected__sub");
  var addCountElement = document.getElementById("orderCountSelected__add");
  var oldQuantityCount=quantityCountElement.value;
  subCountElement.addEventListener("click",()=>{
    if(parseInt(quantityCountElement.value)>1){
      quantityCountElement.value=(parseInt(quantityCountElement.value)-1)}
  })
  addCountElement.addEventListener("click",()=>{
   
      quantityCountElement.value=(parseInt(quantityCountElement.value)+1)
  })
  quantityCountElement.addEventListener("input",(e)=>{
    if(isNaN( e.target.value)){
      e.target.value=oldQuantityCount;
    }else{
      
      oldQuantityCount=e.target.value;
    }
  })
}


updateCart();
    function updateCart() {
        let cartJson = localStorage.getItem("cart");
        if (cartJson) {
            let cart = JSON.parse(cartJson);
            document.querySelector(".cart__number b").innerHTML = cart.length;
        } else {
            document.querySelector(".cart__number b").innerHTML = "0";
        }
    }