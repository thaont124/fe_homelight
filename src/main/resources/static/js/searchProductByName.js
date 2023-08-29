if (localStorage.getItem("Token")) {
}
else {
    window.location = "/fe/login";
}

var first = 1;
var pageSize = 8
var listProduct = [];
var checksortByNameIncrease = false;
var checksortByCodeIncrease = false;

document.addEventListener("DOMContentLoaded", function () {
    getListProduct();

    const sortByNameSpan = document.getElementById('sortByName')
    sortByNameSpan.addEventListener("click", function (event) {
        sortByName();
      });

    
    const sortByCodeSpan = document.getElementById('sortByCode')
    sortByCodeSpan.addEventListener("click", function (event) {
        sortByCode();
    });

    const inputElement = document.getElementById("productSearch");
    inputElement.value = `${window.location.pathname.substring(19)}`
    inputElement.addEventListener("change", function(event) {
        const inputValue = event.target.value;
        if(inputValue.trim() != ''){
            window.location = "/fe/product/search/" + inputValue
        } else{
            window.location = "/fe/product/viewAll"
        }
    });
});

var rotationName = 0;
function sortByName(){
    rotationName+=180
    if(!checksortByNameIncrease){
        checksortByNameIncrease = true
        listProduct.sort((a, b) => a.productName.localeCompare(b.productName));
    }
    else{
        checksortByNameIncrease = false
        listProduct.sort((a, b) => b.productName.localeCompare(a.productName));
    }
    document.getElementById("sortByName").style.transform = `rotate(${rotationName}deg)`
    showProductsByIndex(1)
}
var rotationCode = 0;
function sortByCode(){
    rotationCode += 180;
    if(!checksortByNameIncrease){
        checksortByCodeIncrease = true
        listProduct.sort((a, b) => a.productCode.localeCompare(b.productCode));
    }
    else{
        checksortByCodeIncrease = false
        listProduct.sort((a, b) => b.productCode.localeCompare(a.productCode));
    }
    document.getElementById("sortByCode").style.transform = `rotate(${rotationCode}deg)`
    showProductsByIndex(1)
}

function getListProduct() {
    var index = 1;
    fetchlistProduct(index);
}

function fetchlistProduct(index) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        if (xhttp.status == 200) {
            var ResponseJson = xhttp.responseText;
            var Response = JSON.parse(ResponseJson);

            if (Response.length > 0) {
                for (var i = 0; i < Response.length; i++) {
                    listProduct.push(Response[i]);
                }

                fetchlistProduct(index + 1);
            } else {
                updatePaginationButtons();
                showProductsByIndex(1);
            }
        } else if (xhttp.status == 204) {
        } else if (xhttp.status == 401) {
            localStorage.removeItem("Token");
            window.location = "/Admin/Login";
        } else if (xhttp.status == 403) {
            localStorage.removeItem("Token");
            window.location = "/Admin/Login";
        }
    };

    xhttp.open("GET", `http://26.127.173.194:8080/api/v1.0/ProductByName/${window.location.pathname.substring(19)}?pageNo=${index}&pageSize=8`, false);

    xhttp.setRequestHeader("Content-type", "application/json");
    token = localStorage.getItem("Token");
    authorization = 'Bearer ' + token;
    xhttp.setRequestHeader("Authorization", authorization);
    xhttp.send();
}

function updatePaginationButtons() {
    var paginationHTML = document.getElementById('pagination');
    paginationHTML.innerHTML = '';
    var pageNumber = Math.ceil(listProduct.length / 8)
    for (var i = 0; i < pageNumber; i++) {
        paginationHTML.innerHTML += `<button class="page-button" index="${i + 1}" onclick="showProductsByIndex(${i + 1})">${i + 1}</button>`;
    }
}

function showProductsByIndex(index) {
    var tableProductElement = document.getElementById('productInformation');
    console.log(listProduct)
    console.log(index)
    var start = (index - 1) * pageSize;
    var end = Math.min(index * pageSize, listProduct.length - 1)
    if(end == start){
        end++;
    }
    var tableProductHtml = '';
    for (var i = start; i < end; i++) {
        console.log(listProduct[i])
        var imgHTML = '';
        for (var j = 0; j < listProduct[i].image.length; i++) {
            if (listProduct[i].image[j].type = 'image') {
                imgHTML = listProduct[i].image[j].url;
                break;
            }
        }
        var isChecked = listProduct[i].status === "ACTIVE";
        tableProductHtml += `
            <tr>
                <td class="main-infor ">
                    <a href="https://www.facebook.com/">
                        <img
                        class="product-img"
                        src="`+ imgHTML + `"
                        />
                        <div class="product-name">
                        <h5>` + listProduct[i].productName + `</h5>
                        </div>
                    </a>
                </td>
                <td> 
                    <p>` + listProduct[i].productCode + `</p>
                </td>
                <td>
                    <label class="toggle">
                        <input type="checkbox" id="toggleSwitch" idProduct="${listProduct[i].id}" class="toggle-checkbox" ${isChecked ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </td>
                <td class="action">
                    <a href="/fe/product/edit/` + listProduct[i].id + `" class="edit" data-toogle="tooltip" data-original-title="Sửa">
                        <i class="fa fa-pencil"></i>
                    </a>
                    <a onclick="confirmDelete(`+ listProduct[i].id + `, '` + listProduct[i].productCode + `')" class="delete" data-toogle="tooltip" data-original-title="Xoá">
                        <i class="fa fa-trash-o"></i>
                    </a>
                </td>
            </tr>`;
    }
    tableProductElement.innerHTML = tableProductHtml;
    document.querySelectorAll(".toggle-checkbox").forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            var idProduct = checkbox.getAttribute('idProduct');
            const xhttp = new XMLHttpRequest();
            xhttp.onload = function () {
                if (xhttp.status === 200) {
                    var ResponseJson = xhttp.responseText;
                    var Response = JSON.parse(ResponseJson);
                    if (Response.status === 'ACTIVE') {
                        checkbox.checked = true;
                    } else {
                        checkbox.checked = false;
                    }
                } else {
                    console.error('Failed to update product status.');
                }
            };
            xhttp.onerror = function () {
                console.error('An error occurred.');
            };

            xhttp.open('PATCH', 'http://26.127.173.194:8080/api/v1.0/changelistProducttatus/' + idProduct);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            var jwtToken = localStorage.getItem("Token");
            xhttp.setRequestHeader('Authorization', 'Bearer ' + jwtToken);
            xhttp.send();
        });
    });

}
function confirmDelete(productId, productName) {
    function showSuccessNotification(message) {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        document.body.appendChild(overlay);

        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = `
          <div class="notification-content">
            <p>${message}</p>
            <button id="deleteButton">Xóa</button>
            <button id="cancelButton">Hủy</button>
          </div>
        `;
        document.body.appendChild(notification);

        const deleteButton = document.getElementById('deleteButton');
        const cancelButton = document.getElementById('cancelButton');

        deleteButton.addEventListener('click', () => {
            closeNotification();
            deleteProduct(productId, productName);
        });

        cancelButton.addEventListener('click', () => {
            closeNotification();
        });

        function closeNotification() {
            document.body.removeChild(notification);
            document.body.removeChild(overlay);
        }
    }

    showSuccessNotification("Bạn có chắc chăn muốn xóa sản phẩm " + productName + " không?")
}

function deleteProduct(productId, productName) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        if (xhttp.status == 204) {
            function showSuccessNotification(message) {
                const overlay = document.createElement('div');
                overlay.classList.add('overlay');
                document.body.appendChild(overlay);

                const notification = document.createElement('div');
                notification.classList.add('notification');
                notification.innerHTML = `
                        <div class="notification-content">
                            <p> ${message}</p>
                            <button id="okButton">OK</button>
                        </div>
                    `;
                document.body.appendChild(notification);

                const okButton = document.getElementById('okButton');
                okButton.addEventListener('click', () => {
                    document.body.removeChild(notification);
                    window.location = '/fe/product/viewAll';
                });
            }
            function closeNotification() {
                document.body.removeChild(notification);
                document.body.removeChild(overlay);
            }
            showSuccessNotification("Bạn đã xóa sản phẩm " + productName + " thành công")
        } else if (xhttp.status == 204) {

        } else if (xhttp.status == 401) {
            localStorage.removeItem("Token");
            window.location = "/Admin/Login";
        } else if (xhttp.status == 403) {
            localStorage.removeItem("Token");
            window.location = "/Admin/Login";
        }
    }

    xhttp.open("DELETE", "http://26.127.173.194:8080/api/v1.0/ProductDetail/" + productId, false);

    xhttp.setRequestHeader("Content-type", "application/json");
    token = localStorage.getItem("Token");
    authorization = 'Bearer ' + token;
    xhttp.setRequestHeader("Authorization", authorization);
    xhttp.send();
}

