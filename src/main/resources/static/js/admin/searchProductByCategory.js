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

    xhttp.open("GET", domain + "/user", false);

    xhttp.setRequestHeader("Content-type", "application/json")
    token = localStorage.getItem("Token");
    authorization = 'Bearer ' + token
    xhttp.setRequestHeader("Authorization", authorization);
    xhttp.send();

}
if (localStorage.getItem("Token")) {
    CheckAdmin();
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
    categories()
    const sortByNameSpan = document.getElementById('sortByName')
    sortByNameSpan.addEventListener("click", function (event) {
        sortByName();
    });


    const sortByCodeSpan = document.getElementById('sortByCode')
    sortByCodeSpan.addEventListener("click", function (event) {
        sortByCode();
    });

    const inputElement = document.getElementById("productSearch");
    inputElement.addEventListener("change", function (event) {
        const inputValue = event.target.value;
        if (inputValue.trim() != '') {
            window.location = "/fe/product/search/" + inputValue
        }
        else{
            window.location = "/fe/product/viewAll"
        }
    });


    /* SỰ KIỆN KÉO THẢ */
    // Lấy danh sách các hàng có thuộc tính draggable
    const rows = document.querySelectorAll('tr[draggable="true"]');
    let draggedProduct = null;

    // Thêm sự kiện dragstart cho toàn bộ trang
    document.addEventListener('dragstart', (e) => {
        const row = e.target.closest('tr[draggable="true"]');
        if (row) {
            draggedProduct = listProduct.find(product => product.id === parseInt(row.getAttribute('data-product-id')));
        }
    });

    // Thêm sự kiện dragover cho toàn bộ trang
    document.addEventListener('dragover', (e) => {
        e.preventDefault(); // Ngăn mặc định để cho phép thả
    });

    // Thêm sự kiện drop cho toàn bộ trang
    document.addEventListener('drop', (e) => {
        e.preventDefault(); // Ngăn mặc định để cho phép thả

        if (draggedProduct) {
            const targetRow = e.target.closest('tr[draggable="true"]');
            if (targetRow) {
                const targetProduct = listProduct.find(product => product.id === parseInt(targetRow.getAttribute('data-product-id')));
                if (targetProduct) {
                    // Tìm vị trí của sản phẩm được kéo và sản phẩm được thả trong danh sách
                    const draggedIndex = listProduct.indexOf(draggedProduct);
                    const targetIndex = listProduct.indexOf(targetProduct);

                    // Di chuyển sản phẩm được kéo đến vị trí của sản phẩm được thả trong danh sách
                    if (draggedIndex !== -1 && targetIndex !== -1) {
                        listProduct.splice(draggedIndex, 1); // Loại bỏ sản phẩm được kéo khỏi danh sách
                        listProduct.splice(targetIndex, 0, draggedProduct); // Chèn sản phẩm được kéo vào vị trí của sản phẩm được thả
                    }
                    console.log(listProduct);

                    // Cập nhật giao diện
                    var button = document.querySelector('.page-button.active');
                    var index = button.getAttribute('index');
                    console.log(index); // Giá trị của thuộc tính 'index'
                    showProductsByIndex(index);


                    listProductRequest = []
                    for (var i = 0; i < listProduct.length-1; i++) {
                        if(draggedProduct.id == listProduct[i].id){
                            listProductRequest.push({
                                productId: listProduct[i].id,
                                orderSort: listProduct[i+1].orderSort +1
                            })
                        }
                        else {
                            listProductRequest.push({
                                productId: listProduct[i].id,
                                orderSort: listProduct[i].orderSort
                            })
                        }
                    }
                    if(draggedProduct.id == listProduct[i].id){
                        listProductRequest.push({
                            productId: listProduct[i].id,
                            orderSort: listProduct[i-1].orderSort - 1
                        })
                    }
                    else {
                        listProductRequest.push({
                            productId: listProduct[i].id,
                            orderSort: listProduct[i].orderSort
                        })
                    }
                    
                    console.log("listProductRequest ", listProductRequest)
                    const xhttp = new XMLHttpRequest();
                    xhttp.onload = function () {
                        if (xhttp.status == 200) {
                            console.log("sorted success")
                        } else if (xhttp.status == 204) {
                        } else if (xhttp.status == 401) {
                            localStorage.removeItem("Token");
                            window.location = "/fe/login";
                        } else if (xhttp.status == 403) {
                            localStorage.removeItem("Token");
                            window.location = "/fe/login";
                        }
                    };

                    xhttp.open("PATCH", `${domain}/api/v1.0/changeOrderSort`, false);
                    xhttp.setRequestHeader("Content-type", "application/json");
                    token = localStorage.getItem("Token");
                    authorization = 'Bearer ' + token;
                    xhttp.setRequestHeader("Authorization", authorization);
                    xhttp.send(JSON.stringify(listProductRequest));

                    draggedProduct = null; // Đặt lại sản phẩm được kéo
                }
            }
        }
    });



});

function categories() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        const ResponseJson = xhttp.responseText;
        const Response = JSON.parse(ResponseJson);
        if (xhttp.status === 200) {
            showCategories(Response);
        } else {
            // Handle error
        }
    };
    xhttp.open("GET", domain + "/api/v1.0/Categories", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function showCategories(categorieList) {
    const navbar = document.getElementById("navbar");
    navbar.innerHTML = ''
    var aElement = document.createElement('a')
    aElement.href = '/fe/product/viewAll';
    aElement.textContent = 'Thể loại'
    navbar.appendChild(aElement) ;
    const ulNav = document.createElement('ul')
    categorieList.forEach(category => {
        const categoryLi = createCategoryElement(category);
        ulNav.appendChild(categoryLi);
    });
    navbar.appendChild(ulNav)
}

function createCategoryElement(category) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = category.categoryName;
    a.href = "/fe/product/byCategory/" + category.id
    li.appendChild(a);

    if (category.children.length > 0) {
        const ul = document.createElement("ul");
        category.children.forEach(child => {
            const childLi = createCategoryElement(child);
            ul.appendChild(childLi);
        });
        li.appendChild(ul);
    }

    return li;
}

var rotationName = 0;
function sortByName() {
    rotationName += 180
    if (!checksortByNameIncrease) {
        checksortByNameIncrease = true
        listProduct.sort((a, b) => a.productName.localeCompare(b.productName));
    }
    else {
        checksortByNameIncrease = false
        listProduct.sort((a, b) => b.productName.localeCompare(a.productName));
    }
    document.getElementById("sortByName").style.transform = `rotate(${rotationName}deg)`
    showProductsByIndex(1)
}
var rotationCode = 0;
function sortByCode() {
    rotationCode += 180;
    if (!checksortByCodeIncrease) {
        checksortByCodeIncrease = true
        listProduct.sort((a, b) => a.productCode.localeCompare(b.productCode));
    }
    else {
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
            window.location = "/fe/login";
        } else if (xhttp.status == 403) {
            localStorage.removeItem("Token");
            window.location = "/fe/login";
        }
    };

    xhttp.open("GET", `${domain}/api/v1.0/ProductByCategory/${window.location.pathname.substring(23)}?pageNo=${index}&pageSize=${pageSize}`, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    token = localStorage.getItem("Token");
    authorization = 'Bearer ' + token;
    xhttp.setRequestHeader("Authorization", authorization);
    xhttp.send();
}

function updatePaginationButtons() {
    var paginationHTML = document.getElementById('pagination');
    paginationHTML.innerHTML = '';
    var pageNumber = Math.ceil(listProduct.length / pageSize)
    for (var i = 0; i < pageNumber; i++) {
        paginationHTML.innerHTML += `<button class="page-button" index="${i + 1}" onclick="showProductsByIndex(${i + 1})">${i + 1}</button>`;
    }
}

function showProductsByIndex(index) {
    var tableProductElement = document.getElementById('productInformation');
    console.log(listProduct)
    var start = (index - 1) * pageSize;
    var end = Math.min(index * pageSize, listProduct.length)
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
            <tr draggable="true" data-product-id=`+ listProduct[i].id + `>
                <td class="main-infor ">
                    <a href="/fe/product/edit/` + listProduct[i].id + `">
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
                    <a class="edit" onclick="moveToTop(`+ listProduct[i].id + `)" data-toggle="tooltip" data-original-title="Đưa sản phẩm lên đầu">
                        <i class="fa fa-arrow-up"></i>
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

            xhttp.open('PATCH', '${domain}/api/v1.0/changeProductStatus/' + idProduct);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            var jwtToken = localStorage.getItem("Token");
            xhttp.setRequestHeader('Authorization', 'Bearer ' + jwtToken);
            xhttp.send();
        });
    });

    updatePaginationButtons()
    var currentPage = document.querySelector(`.page-button[index="${index}"]`);
    if (currentPage) {
        currentPage.classList.add('active');
    } else {
        console.error('Không tìm thấy phần tử với class "page-button" và index', index);
    }
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
            window.location = "/fe/login";
        } else if (xhttp.status == 403) {
            localStorage.removeItem("Token");
            window.location = "/fe/login";
        }
    }

    xhttp.open("DELETE", domain + "/api/v1.0/ProductDetail/" + productId, false);

    xhttp.setRequestHeader("Content-type", "application/json");
    token = localStorage.getItem("Token");
    authorization = 'Bearer ' + token;
    xhttp.setRequestHeader("Authorization", authorization);
    xhttp.send();
}

function moveToTop(idProduct) {
    const product = listProduct.find(item => item.id === parseInt(idProduct));

    if (product) {
        const index = listProduct.indexOf(product);
        if (index > -1) {
            listProduct.splice(index, 1);
        }

        listProduct.unshift(product);

        // Cập nhật giao diện
        var button = document.querySelector('.page-button.active');
        var pageNo = button.getAttribute('index');
        console.log(pageNo); // Giá trị của thuộc tính 'index'
        showProductsByIndex(pageNo);
        console.log(listProduct);

        //cập nhật db
        listProductRequest = []
        for (var i = 0; i < listProduct.length; i++) {
            listProductRequest.push({
                productId: listProduct[i].id,
                orderSort: listProduct.length - i
            })
        }
        console.log("listProductRequest ", listProductRequest)
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            if (xhttp.status == 200) {
                console.log("sorted success")
            } else if (xhttp.status == 204) {
            } else if (xhttp.status == 401) {
                localStorage.removeItem("Token");
                window.location = "/fe/login";
            } else if (xhttp.status == 403) {
                localStorage.removeItem("Token");
                window.location = "/fe/login";
            }
        };

        xhttp.open("PATCH", `${domain}/api/v1.0/changeOrderSort`, false);
        xhttp.setRequestHeader("Content-type", "application/json");
        token = localStorage.getItem("Token");
        authorization = 'Bearer ' + token;
        xhttp.setRequestHeader("Authorization", authorization);
        xhttp.send(JSON.stringify(listProductRequest));
    }
}