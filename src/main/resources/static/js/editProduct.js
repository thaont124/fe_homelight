/* ----------------------------------------------KHỞI TẠO---------------------------------------------- */
var choiceList = []             //choiceName, choiceValues: [0: , 1: ]
var variantList = []     //100(Price) : [{choiceName, choiceValues: [0: , 1: ]} {choiceName, choiceValues: [0: , 1: ]}]
var saleList = []               //choices[0: {choiceName, choiceValue}, 1: ...] : sale{saleNumber, startDate, endDate}
var selectedImages = []
var categoryOfProduct = []

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
var categoryData = [];
const categoryTreeContainer = document.querySelector('.category__tree');

function categories() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    const ResponseJson = xhttp.responseText;
    const Response = JSON.parse(ResponseJson);
    if (xhttp.status === 200) {
      categoryData = Response;
      renderCategoryTree(categoryData, categoryTreeContainer);
    } else {
      // Handle error
    }
  };
  xhttp.open("GET", "http://localhost:8080/api/v1.0/Categories", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
}

function createCategoryNode(category) {
  const node = document.createElement("div");
  node.className = "category__tree__branch";

  const label = document.createElement("label");
  label.className = "branch__label";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "branch__checkbox";
  checkbox.setAttribute("categoryId", category.id);

  checkbox.addEventListener("change", function () {
    if (checkbox.checked == true){
      toggleParentCheckboxes(node, checkbox.checked); 
      checkbox.checked = true; 
    }
    else{
      toggleChildrenCheckboxes(node, false);
      checkbox.checked = false; 
    }
    
    
  });

  const text = document.createTextNode(category.categoryName);

  label.appendChild(checkbox);
  label.appendChild(text);

  if (category.children.length > 0) {
    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.innerText = "▶";
    arrow.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleChildrenVisibility(node);
    });
    label.appendChild(arrow);
  }

  node.appendChild(label);

  if (category.children.length > 0) {
    const childContainer = document.createElement("ul");
    childContainer.className = "branch__list";
    childContainer.style.display = "none";
    category.children.forEach(child => {
      const childNode = createCategoryNode(child);
      childContainer.appendChild(childNode);
    });
    node.appendChild(childContainer);
  }

  return node;
}

function toggleParentCheckboxes(node, isChecked) {
  const parentCheckbox = node.querySelector(".branch__checkbox");
  if (parentCheckbox) {
    parentCheckbox.checked = isChecked;
    const parentNode = node.parentNode.closest(".category__tree__branch");
    if (parentNode) {
      toggleParentCheckboxes(parentNode, isChecked);
    }
  }
}

function toggleChildrenCheckboxes(node, isChecked) {
  const checkboxes = node.querySelectorAll(".branch__checkbox");
  checkboxes.forEach(checkbox => {
    checkbox.checked = isChecked;
  });
}

function toggleChildrenVisibility(node) {
  const childContainer = node.querySelector(".branch__list");
  if (childContainer) {
    childContainer.style.display = childContainer.style.display === "none" ? "block" : "none";
  }
}

function renderCategoryTree(data, container) {
  container.innerHTML = "";
  data.forEach(category => {
    const categoryNode = createCategoryNode(category);
    container.appendChild(categoryNode);
  });
}

categories();

//------------------ tick các category cũ
function checkCategoryInTree(node, categoryId) {
  const checkbox = node.querySelector(`input[categoryid="${categoryId}"]`);
  if (checkbox) {
    checkbox.checked = true;
  }
}

function checkCategoriesInTree(data) {
  data.forEach(category => {
    checkCategoryInTree(categoryTreeContainer, category.id);
    checkCategoriesInTree(category.children);
  });
}

checkCategoriesInTree(categoryOfProduct);


/* ----------------------------------------------XỬ LÝ ẢNH---------------------------------------------- */
const selectedImagesContainer = document.getElementById('selected-images');
const imageInput = document.getElementById('image-input');
const overlay = document.getElementById('overlay');
const overlayContent = document.getElementById('overlay-content');

function createImageElement(url, type) {
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('selected-image-wrapper');

  const mediaElement = type === 'image' ? document.createElement('img') : document.createElement('video');
  mediaElement.classList.add('selected-media');
  mediaElement.src = url;

  mediaElement.addEventListener('click', () => displayMedia(mediaElement.src, type));

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = 'Xóa';
  deleteButton.addEventListener('click', () => {
    removeMedia(url);
    imageWrapper.remove();
  });

  imageWrapper.appendChild(mediaElement);
  imageWrapper.appendChild(deleteButton);

  return imageWrapper;
}

function displayMedia(url, type) {
  overlayContent.innerHTML = '';

  if (type === 'image') {
    const image = document.createElement('img');
    image.src = url;
    overlayContent.appendChild(image);
  } else if (type === 'video') {
    const video = document.createElement('video');
    video.src = url;
    video.controls = true;
    overlayContent.appendChild(video);
  }

  overlay.style.display = 'block';
}

function removeMedia(url) {
  const index = selectedImages.findIndex(image => image.url === url);
  if (index !== -1) {
    selectedImages.splice(index, 1);
  }
  console.log(selectedImages)
}

overlay.addEventListener('click', () => {
  overlay.style.display = 'none';
  overlayContent.innerHTML = '';
});

imageInput.addEventListener('change', (event) => {
  const files = event.target.files;

  for (const file of files) {
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      const imageElement = createImageElement(URL.createObjectURL(file), type);
      selectedImages.push({ url: imageElement.querySelector('img, video').src, type: type });
      selectedImagesContainer.appendChild(imageElement);
    }
  }
  console.log(selectedImages)

  event.target.value = null;
});


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
          <div class="choice__choiceInfo__choiceValue">
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

  for (var j = 0; j < choiceList.length; j++) {
    var choice = choiceList[j];
    var selectElement = document.createElement('select');
    selectElement.classList.add('select__exception');
    var optionAll = document.createElement('option');
    optionAll.setAttribute('all', 'true');
    optionAll.selected = true;
    optionAll.textContent = `Mọi ${choice.choiceName}`;
    selectElement.appendChild(optionAll);

    for (var k = 0; k < choice.choiceValues.length; k++) {
      var option = document.createElement('option');
      option.textContent = choice.choiceValues[k];
      selectElement.appendChild(option);
    }

    choiceInfoDiv.appendChild(selectElement);
  }

  var addValueDiv = document.createElement("div");
  addValueDiv.classList.add("choice__addValue");
  var priceInput = document.createElement("input");
  priceInput.type = "text";
  priceInput.id = "priceChoice";
  priceInput.name = "priceChoice";
  priceInput.placeholder = "Giá cả";
  priceInput.required = true;
  addValueDiv.appendChild(priceInput);

  // var addButton = document.createElement("button");
  // addButton.textContent = "+";
  // addButton.classList.add("plus-button");
  // addButton.onclick = function () {
  //   addExceptionValue(addButton);
  // };
  // addValueDiv.appendChild(addButton);

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

  for (var j = 0; j < choiceList.length; j++) {
    var choice = choiceList[j];
    var selectElement = document.createElement('select');
    selectElement.classList.add('select__exception');
    var optionAll = document.createElement('option');
    optionAll.setAttribute('all', 'true');
    optionAll.selected = true;
    optionAll.textContent = `Mọi ${choice.choiceName}`;
    selectElement.appendChild(optionAll);

    for (var k = 0; k < choice.choiceValues.length; k++) {
      var option = document.createElement('option');
      option.textContent = choice.choiceValues[k];
      selectElement.appendChild(option);
    }

    parentExceptionDiv.appendChild(selectElement);
  }
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
  saleChoiceDiv.classList.add("choice__salechoice");

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

  // var addValueDiv = document.createElement("div");
  // addValueDiv.classList.add("choice__addValue");
  // var addButton = document.createElement("button");
  // addButton.textContent = "+";
  // addButton.onclick = function () {
  //   addSaleChoiceValue(addValueDiv);
  // };
  // addButton.classList.add("plus-button");
  // addValueDiv.appendChild(addButton);

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



/* ----------------------------------------------XỬ LÝ REQUEST HIỂN THỊ THÔNG TIN CŨ SẢN PHẨM---------------------------------------------- */

viewProduct()
function viewProduct() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (xhttp.status == 200) {
      var ResponseJson = xhttp.responseText;
      var Response = JSON.parse(ResponseJson);


      for (var i = 0; i < Response.variantsDTO.length; i++) {
        const variant = Response.variantsDTO[i];

        //Add choiceList
        for (var j = 0; j < variant.choices.length; j++) {
          const choice = variant.choices[j];

          const existingChoice = choiceList.find(item =>
            item.choiceName === choice.choiceName && item.choiceValues.includes(choice.choiceValue)
          );
          if (!existingChoice) {
            const choiceEntry = choiceList.find(item => item.choiceName === choice.choiceName);

            if (choiceEntry) {
              choiceEntry.choiceValues.push(choice.choiceValue);
            } else {
              choiceList.push({
                choiceName: choice.choiceName,
                choiceValues: [choice.choiceValue]
              });
            }
          }
        }

        //Add variantList 
        const variantPrice = variant.originPrice;
        const variantChoices = variant.choices.map(choice => {
          return {
            id: choice.id,
            choiceName: choice.choiceName,
            choiceValue: choice.choiceValue
          };
        });

        if (!variantList.some(item => item.price === variantPrice)) {
          variantList.push({
            price: variantPrice,
            choices: [variantChoices]
          });
        } else {
          const index = variantList.findIndex(item => item.price === variantPrice);
          variantList[index].choices.push(variantChoices);
        }

        //Add saleList
        const variantSales = variant.sale;
        if (variantSales.length > 0) {
          for (const sale of variantSales) {
            const choices = variant.choices.map(choice => {
              return {
                choiceName: choice.choiceName,
                choiceValue: choice.choiceValue
              };
            });

            saleList.push({
              choices: choices,
              sale: {
                saleNumber: sale.numberSale,
                startDate: new Date(sale.startDate),
                toDate: new Date(sale.endDate)
              }
            });
          }
        }
      }
      variantList.sort((a, b) => b.choices.length - a.choices.length);
      saleList.sort((a, b) => a.sale.startDate - b.sale.startDate);


      //result
      console.log(choiceList)
      console.log(variantList)
      console.log(saleList)


      //display
      //product_infor
      var productNameInput = document.getElementById('info__productName');
      var productCodeInput = document.getElementById('info__productCode');
      var priceNoChoiceInput = document.getElementById('priceNoChoice');
      var description = document.getElementById('description');

      productNameInput.value = Response.productName;
      productCodeInput.value = Response.productCode;
      priceNoChoiceInput.value = variantList[0].price;
      description.value = Response.description;

      //product_image
      console.log(Response.image)
      for (var i = 0; i < Response.image.length; i++) {
        const mediaElement = createImageElement(Response.image[i].url, Response.image[i].type);
        selectedImagesContainer.appendChild(mediaElement);
      };


      //choice
      const choiceContainer = document.getElementById('choice');
      if (choiceList.length > 0) {
        showFormChoice()
      }
      for (var i = 0; i < choiceList.length; i++) {
        const choice = choiceList[i];

        const choiceWrapper = document.createElement('div');
        choiceWrapper.classList.add('container__variant__choice');

        const choiceDiv = document.createElement('div');
        choiceDiv.classList.add('choice__choiceInfo');

        const choiceNameDiv = document.createElement('div');
        choiceNameDiv.classList.add('choice__choiceInfo__choiceName');
        const choiceNameInput = document.createElement('input');
        choiceNameInput.type = 'text';
        choiceNameInput.name = 'choiceName';
        choiceNameInput.placeholder = 'Phân loại theo';
        choiceNameInput.value = choice.choiceName
        choiceNameInput.setAttribute('choiceName-data', (i + 1));
        choiceNameInput.required = true;
        choiceNameDiv.appendChild(choiceNameInput);
        choiceDiv.appendChild(choiceNameDiv);

        const choiceValueDiv = document.createElement('div');
        choiceValueDiv.classList.add('choice__choiceInfo__choiceValue');
        for (var j = 0; j < choice.choiceValues.length; j++) {
          const choiceValueInput = document.createElement('input');
          choiceValueInput.type = 'text';
          choiceValueInput.name = 'choiceValue';
          choiceValueInput.id = "choiceValueElement";
          choiceValueInput.placeholder = 'Giá trị phân loại';
          choiceValueInput.value = choice.choiceValues[j]
          choiceValueInput.setAttribute('choiceValue-data', (j + 1));
          choiceValueInput.required = true;
          choiceValueDiv.appendChild(choiceValueInput);
        }
        choiceDiv.appendChild(choiceValueDiv);

        var addChoiceDiv = document.createElement('div');
        addChoiceDiv.className = "choice__addValue"
        addChoiceDiv.innerHTML = `
            <button onclick="addChoiceValue(this)" class="plus-button">+</button>
        `;

        choiceWrapper.appendChild(choiceDiv);
        choiceWrapper.appendChild(addChoiceDiv);

        choiceContainer.insertBefore(choiceWrapper, choiceContainer.firstChild);
      }

      //exception 
      var exceptionContainer = document.getElementById('exception');

      if (variantList.length > 1) {
        showExceptionForm()
      }
      for (var i = 1; i < variantList.length; i++) {
        var variant = variantList[i];
        var choiceExceptionContainer = document.createElement('div');
        choiceExceptionContainer.classList.add('container__exception__choice');

        var choiceInfoDiv = document.createElement('div');
        choiceInfoDiv.classList.add('choice__choiceInfo');

        for (var j = 0; j < choiceList.length; j++) {
          var choice = choiceList[j];
          var selectElement = document.createElement('select');
          selectElement.classList.add('select__exception');
          var optionAll = document.createElement('option');
          optionAll.setAttribute('all', 'true');
          optionAll.selected = true;
          optionAll.textContent = `Mọi ${choice.choiceName}`;
          selectElement.appendChild(optionAll);

          for (var k = 0; k < choice.choiceValues.length; k++) {
            var option = document.createElement('option');
            option.textContent = choice.choiceValues[k];
            if (variant.choices[0].find(c => c.choiceName === choice.choiceName && c.choiceValue === option.textContent)) {
              option.selected = true;
            }
            selectElement.appendChild(option);
          }

          choiceInfoDiv.appendChild(selectElement);
        }

        choiceExceptionContainer.appendChild(choiceInfoDiv);

        var priceInput = document.createElement('input');
        priceInput.type = 'text';
        priceInput.id = 'priceChoice';
        priceInput.name = 'priceChoice';
        priceInput.placeholder = 'Giá cả';
        priceInput.value = variant.price;
        priceInput.required = true;

        var addValueDiv = document.createElement('div');
        addValueDiv.classList.add('choice__addValue');
        addValueDiv.appendChild(priceInput);

        choiceExceptionContainer.appendChild(addValueDiv);

        exceptionContainer.insertBefore(choiceExceptionContainer, exceptionContainer.firstChild);
      }

      //sale
      var saleContainer = document.getElementById('sale');
      if (saleList.length > 0) {
        showSaleForm()
      }
      for (var i = 0; i < saleList.length; i++) {
        var sale = saleList[i];
        var choiceSaleContainer = document.createElement('div');
        choiceSaleContainer.classList.add('container__sale__choice');

        var choiceInfoDiv = document.createElement('div');
        choiceInfoDiv.classList.add('choice__choiceInfo');

        for (var j = 0; j < choiceList.length; j++) {
          var choice = choiceList[j];
          var selectElement = document.createElement('select');
          selectElement.classList.add('select__exception');
          var optionAll = document.createElement('option');
          optionAll.setAttribute('all', 'true');
          optionAll.selected = true;
          optionAll.textContent = `Mọi ${choice.choiceName}`;
          selectElement.appendChild(optionAll);

          for (var k = 0; k < choice.choiceValues.length; k++) {
            var option = document.createElement('option');
            option.textContent = choice.choiceValues[k];
            if (sale.choices.find(c => c.choiceName === choice.choiceName && c.choiceValue === option.textContent)) {
              option.selected = true;
            }
            selectElement.appendChild(option);
          }

          choiceInfoDiv.appendChild(selectElement);
        }

        choiceSaleContainer.appendChild(choiceInfoDiv);

        const saleChoiceDiv = document.createElement("div");
        saleChoiceDiv.classList.add("choice__saleChoice");

        const saleInfo__saleNumber = document.createElement("div");
        saleInfo__saleNumber.classList.add("sale-infor");
        const saleNumberInput = document.createElement("input");
        saleNumberInput.type = "text";
        saleNumberInput.id = "saleNumber";
        saleNumberInput.name = "saleNumber";
        saleNumberInput.placeholder = "Vd: 50";
        saleNumberInput.required = true;
        saleNumberInput.value = sale.sale.saleNumber;
        const saleNumberLabel = document.createElement("label");
        saleNumberLabel.for = "saleNumber";
        saleNumberLabel.textContent = "Giảm giá:";
        const saleNumberPercent = document.createElement("span");
        saleNumberInput.value = sale.sale.saleNumber
        saleNumberPercent.textContent = "%";
        saleInfo__saleNumber.appendChild(saleNumberLabel);
        saleInfo__saleNumber.appendChild(saleNumberInput);
        saleInfo__saleNumber.appendChild(saleNumberPercent);


        const saleInfo__startDate = document.createElement("div");
        saleInfo__startDate.classList.add("sale-infor");
        const startDateInput = document.createElement("input");
        startDateInput.type = "datetime-local";
        startDateInput.id = "startDate";
        startDateInput.name = "startDate";
        startDateInput.required = true;
        startDateInput.value = new Date(sale.sale.startDate).toISOString().slice(0, 16)
        const startDateLabel = document.createElement("label");
        startDateLabel.for = "startDate";
        startDateLabel.textContent = "Bắt đầu:";
        saleInfo__startDate.appendChild(startDateLabel);
        saleInfo__startDate.appendChild(startDateInput);

        const saleInfo__endNumber = document.createElement("div");
        saleInfo__endNumber.classList.add("sale-infor");
        const toDateInput = document.createElement("input");
        toDateInput.type = "datetime-local";
        toDateInput.id = "toDate";
        toDateInput.name = "toDate";
        toDateInput.value = new Date(sale.sale.toDate).toISOString().slice(0, 16)
        toDateInput.required = true;

        const toDateLabel = document.createElement("label");
        toDateLabel.for = "toDate";
        toDateLabel.textContent = "Kết thúc:";
        saleInfo__endNumber.appendChild(toDateLabel);
        saleInfo__endNumber.appendChild(toDateInput);

        saleChoiceDiv.appendChild(saleInfo__saleNumber);
        saleChoiceDiv.appendChild(saleInfo__startDate);
        saleChoiceDiv.appendChild(saleInfo__endNumber);


        choiceSaleContainer.appendChild(saleChoiceDiv)
        saleContainer.insertBefore(choiceSaleContainer, saleContainer.firstChild);

        //image
        selectedImages = Response.image;

        //category
        categoryOfProduct = Response.category
      }
    } else if (xhttp.status == 204) {

    } else if (xhttp.status == 401) {
      localStorage.removeItem("Token");
      window.location = "/Admin/Login";
    } else if (xhttp.status == 403) {
      localStorage.removeItem("Token");
      window.location = "/Admin/Login";
    }
  }

  xhttp.open("GET", "http://localhost:8080/api/v1.0/ProductDetail/" + window.location.pathname.substring(17), false);

  xhttp.setRequestHeader("Content-type", "application/json");
  token = localStorage.getItem("Token");
  authorization = 'Bearer ' + token;
  xhttp.setRequestHeader("Authorization", authorization);
  xhttp.send();
}

/* ----------------------------------------------XỬ LÝ REQUEST SỬA SẢN PHẨM---------------------------------------------- */
