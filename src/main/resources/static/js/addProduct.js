/* ----------------------------------------------KHỞI TẠO---------------------------------------------- */
init()
function init() {
  var titles = document.getElementsByClassName("title");
  for (var i = 0; i < titles.length; i++) {
    titles[i].style.display = 'none';
  }

  document.getElementById("showExceptionForm").style.display = 'none'
  document.getElementById("choice").style.display = 'none'
  document.getElementById("exception").style.display = 'none'
  document.getElementById("sale").style.display = 'none'
}

/* ----------------------------------------------XỬ LÝ CÂY---------------------------------------------- */

// Lấy danh sách các thư mục gốc
var rootFolders = document.querySelectorAll(".category__tree__branch");

// Bắt sự kiện khi người dùng nhấp vào thư mục gốc
rootFolders.forEach(function(rootFolder) {
  var label = rootFolder.querySelector(".branch__label");
  label.addEventListener("click", function() {
    var sublist = rootFolder.querySelector(".branch__list");
    sublist.classList.toggle("open"); // Thêm hoặc loại bỏ class "open" để hiển thị/ẩn thư mục cấp 1
  });
});



/* ----------------------------------------------XỬ LÝ ẢNH---------------------------------------------- */
const selectedImagesContainer = document.getElementById('selected-images');
const imageInput = document.getElementById('image-input');

// Hàm để tạo một phần tử ảnh và nút xóa tương ứng
function createImageElement(file) {
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('selected-image-wrapper');

  const img = document.createElement('img');
  img.classList.add('selected-image');
  img.src = URL.createObjectURL(file);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = 'Xóa';
  deleteButton.addEventListener('click', () => {
    imageWrapper.remove();
  });

  imageWrapper.appendChild(img);
  imageWrapper.appendChild(deleteButton);

  return imageWrapper;
}

// Lắng nghe sự kiện khi người dùng chọn tập tin ảnh mới
imageInput.addEventListener('change', (event) => {
  const files = event.target.files;

  // Lặp qua danh sách các tập tin ảnh và thêm chúng vào selectedImagesContainer
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      const imageElement = createImageElement(file);
      selectedImagesContainer.appendChild(imageElement);
    }
  }

  // Đặt giá trị của input về null để cho phép người dùng chọn cùng tập tin ảnh lần tiếp theo
  event.target.value = null;
});


function submit() {
  // Lấy tất cả các phần tử con có lớp là 'selected-image'
  const selectedImageElements = selectedImagesContainer.querySelectorAll('.selected-image');

  // Mảng để lưu trữ các giá trị (ảnh)
  const selectedImages = [];

  // Lặp qua danh sách các phần tử và lấy giá trị (src của ảnh)
  selectedImageElements.forEach((imageElement) => {
    const imageUrl = imageElement.getAttribute('src');
    selectedImages.push(imageUrl);
  });

  // selectedImages giờ chứa danh sách các ảnh đã chọn
  console.log(selectedImages);
}


/* ----------------------------------------------XỬ LÝ PHÂN LOẠI---------------------------------------------- */

var choiceName_index = 0;
function showFormChoice() {
  document.getElementById("choiceTitle").style.display = 'inline-block'
  document.getElementById("choice").style.display = 'flex'
  document.getElementById("showChoice").style.display = 'none'
  document.getElementById("showExceptionForm").style.display = 'inline-block'
}

var choiceName_index = 0;

function addFormChoice() {
  choiceName_index += 1;
  var choiceHTML = document.getElementById("choice");

  // Lưu giá trị input trước đó (nếu có)
  var previousInputValue = "";
  var previousChoiceValueInput = document.querySelector("#choiceValueElement input[name='choiceValue']");
  if (previousChoiceValueInput) {
    previousInputValue = previousChoiceValueInput.value;
  }

  var newChoiceElement = document.createElement("div");
  newChoiceElement.classList.add("container__variant__choice");
  newChoiceElement.innerHTML = `
      <div class="choice__choiceInfo">
          <div class="choice__choiceInfo__choiceName">
              <input type="text" name="choiceName" placeholder="Phân loại theo"
              choiceName-data="${choiceName_index}" required />
          </div>
          <div class="choice__choiceInfo__choiceValue" id="choiceValueElement">
              <input type="text" name="choiceValue" placeholder="Giá trị" choiceValue-data="1" required value="${previousInputValue}" />
          </div>
      </div>
      <div class="choice__addValue">
          <button onclick="addChoiceValue(this)" class="plus-button">+</button>
      </div>
  `;

  choiceHTML.insertBefore(newChoiceElement, choiceHTML.firstChild);
}

function addChoiceValue(button) {
  var choiceValueHTML = button.parentNode.previousElementSibling.querySelector(".choice__choiceInfo__choiceValue");
  var inputElements = choiceValueHTML.getElementsByTagName("input");
  var choiceValue_index = inputElements.length + 1;

  var newChoiceValueInput = document.createElement("input");
  newChoiceValueInput.type = "text";
  newChoiceValueInput.name = "choiceValue";
  newChoiceValueInput.placeholder = "Giá trị";
  newChoiceValueInput.setAttribute("choiceValue-data", choiceValue_index);
  newChoiceValueInput.required = true;

  choiceValueHTML.appendChild(newChoiceValueInput);
}

/* ----------------------------------------------XỬ LÝ NGOẠI LỆ---------------------------------------------- */
function showExceptionForm() {
  document.getElementById("exceptionTitle").style.display = 'inline-block'
  document.getElementById("exception").style.display = 'flex'
  document.getElementById("showExceptionForm").style.display = 'none'
}

var exceptionTitleIndex = 0;

function createExceptionElement() {
  exceptionTitleIndex += 1;
  var exceptionDiv = document.createElement("div");
  exceptionDiv.classList.add("container__exception__choice");

  var choiceInfoDiv = document.createElement("div");
  choiceInfoDiv.classList.add("choice__choiceInfo");

  var selectDiv1 = document.createElement("div");
  selectDiv1.classList.add("select__exception");
  var select1 = document.createElement("select");
  select1.innerHTML = `
        <option disabled selected>--- Chọn màu sắc ---</option>
        <option value="red">Đỏ</option>
        <option value="blue">Xanh</option>
        <option value="green">Lục</option>
    `;
  selectDiv1.appendChild(select1);

  var selectDiv2 = document.createElement("div");
  selectDiv2.classList.add("select__exception");
  var select2 = document.createElement("select");
  select2.innerHTML = `
        <option disabled selected>--- Chọn chất liệu ---</option>
        <option value="red">Vàng</option>
        <option value="blue">Kim cương</option>
    `;
  selectDiv2.appendChild(select2);

  choiceInfoDiv.appendChild(selectDiv1);
  choiceInfoDiv.appendChild(selectDiv2);

  var addValueDiv = document.createElement("div");
  addValueDiv.classList.add("choice__addValue");
  var priceInput = document.createElement("input");
  priceInput.type = "text";
  priceInput.id = "priceChoice";
  priceInput.name = "priceChoice";
  priceInput.placeholder = "Giá cả";
  priceInput.required = true;
  addValueDiv.appendChild(priceInput);

  var addButton = document.createElement("button");
  addButton.textContent = "+";
  addButton.classList.add("plus-button");
  addButton.onclick = function() {
    addExceptionValue(addButton);
  };
  addValueDiv.appendChild(addButton);

  exceptionDiv.appendChild(choiceInfoDiv);
  exceptionDiv.appendChild(addValueDiv);

  return exceptionDiv;
}

function addExceptionForm() {
  var exceptionHTML = document.getElementById("exception");
  var newExceptionElement = createExceptionElement();
  exceptionHTML.insertBefore(newExceptionElement, exceptionHTML.lastElementChild);
}

function addExceptionValue(button) {
  var parentExceptionDiv = button.parentNode.previousElementSibling;

  var selectElement = document.createElement("select");
  selectElement.classList.add("select__exception");
  selectElement.innerHTML = `
      <option disabled selected>--- Chọn màu sắc ---</option>
      <option value="red">Đỏ</option>
      <option value="blue">Xanh</option>
      <option value="green">Lục</option>
  `;

  parentExceptionDiv.appendChild(selectElement);
}


/* ----------------------------------------------XỬ LÝ MÃ GIẢM GIÁ---------------------------------------------- */

function showSaleForm() {
  document.getElementById("saleTitle").style.display = 'inline-block'
  document.getElementById("sale").style.display = 'flex'
  document.getElementById("showSaleForm").style.display = 'none'
}

function createSaleElement() {
  var saleDiv = document.createElement("div");
  saleDiv.classList.add("container__sale__choice");

  var choiceInfoDiv = document.createElement("div");
  choiceInfoDiv.classList.add("choice__choiceInfo");

  var selectDiv1 = document.createElement("div");
  selectDiv1.classList.add("select__exception");
  var select1 = document.createElement("select");
  select1.innerHTML = `
      <option disabled selected>--Màu sắc--</option>
      <option value="red">Đỏ</option>
      <option value="blue">Xanh</option>
      <option value="green">Lục</option>
  `;
  selectDiv1.appendChild(select1);

  var selectDiv2 = document.createElement("div");
  selectDiv2.classList.add("select__exception");
  var select2 = document.createElement("select");
  select2.innerHTML = `
      <option disabled selected>--Chất liệu--</option>
      <option value="red">Vàng</option>
      <option value="blue">Kim cương</option>
  `;
  selectDiv2.appendChild(select2);

  choiceInfoDiv.appendChild(selectDiv1);
  choiceInfoDiv.appendChild(selectDiv2);

  var saleChoiceDiv = document.createElement("div");
  saleChoiceDiv.classList.add("chocie__saleChocie");

  var saleNumberDiv = document.createElement("div");
  saleNumberDiv.classList.add("sale-infor");
  var saleNumberLabel = document.createElement("label");
  saleNumberLabel.setAttribute("for", "saleNumber");
  saleNumberLabel.textContent = "Giảm giá:";
  var saleNumberInput = document.createElement("input");
  saleNumberInput.type = "text";
  saleNumberInput.id = "saleNumber";
  saleNumberInput.name = "saleNumber";
  saleNumberInput.placeholder = "Vd: 50";
  saleNumberInput.required = true;
  var percentSpan = document.createElement("span");
  percentSpan.textContent = "%";
  saleNumberDiv.appendChild(saleNumberLabel);
  saleNumberDiv.appendChild(saleNumberInput);
  saleNumberDiv.appendChild(percentSpan);

  var startDateDiv = document.createElement("div");
  startDateDiv.classList.add("sale-infor");
  var startDateLabel = document.createElement("label");
  startDateLabel.setAttribute("for", "startDate");
  startDateLabel.textContent = "Bắt đầu:";
  var startDateInput = document.createElement("input");
  startDateInput.type = "datetime-local";
  startDateInput.id = "startDate";
  startDateInput.name = "startDate";
  startDateInput.required = true;
  startDateDiv.appendChild(startDateLabel);
  startDateDiv.appendChild(startDateInput);

  var toDateDiv = document.createElement("div");
  toDateDiv.classList.add("sale-infor");
  var toDateLabel = document.createElement("label");
  toDateLabel.setAttribute("for", "toDate");
  toDateLabel.textContent = "Kết thúc:";
  var toDateInput = document.createElement("input");
  toDateInput.type = "datetime-local";
  toDateInput.id = "toDate";
  toDateInput.name = "toDate";
  toDateInput.required = true;
  toDateDiv.appendChild(toDateLabel);
  toDateDiv.appendChild(toDateInput);

  saleChoiceDiv.appendChild(saleNumberDiv);
  saleChoiceDiv.appendChild(startDateDiv);
  saleChoiceDiv.appendChild(toDateDiv);

  var addValueDiv = document.createElement("div");
  addValueDiv.classList.add("choice__addValue");
  var addButton = document.createElement("button");
  addButton.textContent = "+";
  addButton.onclick = function() {
    addSaleChoiceValue(addValueDiv);
  };
  addButton.classList.add("plus-button");
  addValueDiv.appendChild(addButton);

  saleDiv.appendChild(choiceInfoDiv);
  saleDiv.appendChild(saleChoiceDiv);
  saleDiv.appendChild(addValueDiv);

  return saleDiv;
}

function addSaleForm() {
  var saleHTML = document.getElementById("sale");
  var newSaleElement = createSaleElement();
  saleHTML.insertBefore(newSaleElement, saleHTML.lastElementChild);
}

function addSaleChoiceValue(button) {
  var parentSaleDiv = button.closest(".container__sale__choice");

  var selectElement = document.createElement("select");
  selectElement.classList.add("select__exception");
  selectElement.innerHTML = `
      <option disabled selected>--- Chọn màu sắc ---</option>
      <option value="red">Đỏ</option>
      <option value="blue">Xanh</option>
      <option value="green">Lục</option>
  `;

  var choiceInfoDiv = parentSaleDiv.querySelector(".choice__choiceInfo");
  choiceInfoDiv.appendChild(selectElement);
}



/* ----------------------------------------------XỬ LÝ REQUEST---------------------------------------------- */