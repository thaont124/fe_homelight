

if(localStorage.getItem("Token")){
    viewProduct();
}
else{
    window.location="/fe/login";
}

viewProduct()
function viewProduct(){
    const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            if (xhttp.status == 200) {
                var ResponseJson = xhttp.responseText;
                var Response = JSON.parse(ResponseJson);
                var tableProductElement = document.getElementById('productInformation');

                var tableProductHtml = '';
                for (var i = 0; i < Response.length; i++) {
                    var isChecked = Response[i].status === "ACTIVE";
                    tableProductHtml += `
                    <tr>
                        <td class="main-infor ">
                            <a href="https://www.facebook.com/">
                                <img
                                class="product-img"
                                src="`+ Response[i].image[0] + `"
                                />
                                <div class="product-name">
                                <h5>` + Response[i].productName + `</h5>
                                </div>
                            </a>
                        </td>
                        <td>` + Response[i].productCode + `</td>
                        <td>
                            <div class="toggle-container">
                                <input type="checkbox" id="toggle${i}" class="toggle-checkbox" ${isChecked ? 'checked' : ''}>
                                <label for="toggle" class="toggle-label"></label>
                            </div>
                        </td>
                        <td class="action">
                            <a href="/fe/product/edit/` + Response[i].id + `" class="edit" data-toogle="tooltip" data-original-title="Sửa">
                                <i class="fa fa-pencil"></i>
                            </a>
                            <a onclick="confirmDelete(`+ Response[i].id +`)" class="delete" data-toogle="tooltip" data-original-title="Xoá">
                                <i class="fa fa-trash-o"></i>
                            </a>
                        </td>
                    </tr>`;
                }
                tableProductElement.innerHTML = tableProductHtml;
            } else if (xhttp.status == 204) {

            } else if (xhttp.status == 401) {
                localStorage.removeItem("Token");
                window.location = "/Admin/Login";
            } else if (xhttp.status == 403) {
                localStorage.removeItem("Token");
                window.location = "/Admin/Login";
            }
        }
        
        xhttp.open("GET", "http://localhost:8080/api/v1.0/Products", false);
        
        xhttp.setRequestHeader("Content-type", "application/json");
        token = localStorage.getItem("Token");
        authorization = 'Bearer ' + token;
        xhttp.setRequestHeader("Authorization", authorization);
        xhttp.send();
}