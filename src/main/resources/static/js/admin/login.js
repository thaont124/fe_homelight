if (localStorage.getItem("Token")) {
    window.location = "/fe/product/viewAll";
    // window.history.back();
}
else {

}

var userNameInput = document.getElementById("username");
var passwordInput = document.getElementById("password");

var labelUserName = document.querySelector("label[for='" + userNameInput.id + "']");
var labelPassword = document.querySelector("label[for='" + passwordInput.id + "']");
userNameInput.addEventListener("focus", () => {
    labelUserName.style.fontSize = "22px";
    labelPassword.style.fontSize = "16px";
});

passwordInput.addEventListener("focus", () => {
    labelPassword.style.fontSize = "22px";
    labelUserName.style.fontSize = "16px";
});


document.getElementById("username").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        login(); 
    }
});

document.getElementById("password").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        login(); 
    }
});

function login() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {

        if (xhttp.status == 200) {
            var tokenResponseJson = xhttp.responseText;
            var tokenResponse = JSON.parse(tokenResponseJson);
            localStorage.setItem("Token", tokenResponse['token']);
            window.location= '/fe/product/viewAll';
        }
        else {
            document.querySelector('#login_error').innerHTML = '<p>Địa chỉ email này hoặc mật khẩu không đúng</p>';
            document.querySelector('#login_error').style.display = 'block';
        }
    };
    const userInfo = {
        username: userNameInput.value,
        password: passwordInput.value
    };
    postData = JSON.stringify(userInfo);
    xhttp.open("POST", domain + "/Api/v1.0/Login", false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(postData);
}
