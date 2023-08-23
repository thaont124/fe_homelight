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

function checkAndToggleChoiceVisibility() {
  const containerChoice = document.querySelector('#choice .container__variant__choice');
  const choiceContainer = document.querySelector('#choice');
  if (containerChoice) {
  } else {
    choiceContainer.style.display = 'none';
    document.getElementById("choiceTitle").style.display = 'none'
    document.getElementById("showChoice").style.display = 'block'
  }

  const containerException = document.querySelector('#exception .container__exception__choice');
  const exceptionContainer = document.querySelector('#exception');
  if (containerException) {
  } else {
    exceptionContainer.style.display = 'none';
    document.getElementById("exceptionTitle").style.display = 'none'
    document.getElementById("showExceptionForm").style.display = 'block'
  }

  const containerSale = document.querySelector('#sale .container__sale__choice');
  const saleContainer = document.querySelector('#sale');
  if (containerSale) {
  } else {
    saleContainer.style.display = 'none';
    document.getElementById("saleTitle").style.display = 'none'
    document.getElementById("showSaleForm").style.display = 'block'
  }

}

checkAndToggleChoiceVisibility();


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
      tickCategoryInTree(categoryOfProduct)
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

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "branch__checkbox";
  checkbox.setAttribute("categoryid", category.id);

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      toggleParentCheckboxes(node, true);
    } else {
      toggleChildrenCheckboxes(node, false);
      toggleParentCheckboxes(node, true);
      checkbox.checked = false
    }
  });

  const label = document.createElement("label");
  label.className = "branch__label";

  const text = document.createTextNode(category.categoryName);

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

  node.appendChild(checkbox);
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

function tickCategoryInTree(categories) {

  categories.forEach(category => {
    document.querySelector(`.branch__checkbox[categoryid="${category.id}"]`).checked = true
    if (category.children.length > 0) {
      tickCategoryInTree(category.children);
    }
  });
}


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
            <div class="input-container">
              <input type="text" name="choiceValue" class="choice-value-input" placeholder="Giá trị" required="">
              <button onclick="removeValue(this)">x</button>
            </div>
          </div>
      </div>
      <div class="choice__addValue">
          <button onclick="addChoiceValue(this)" class="plus-button">+</button>
          <button onclick="removeChoiceContainer(this)" class="remove-button">x</button>
      </div>
  `;

  choiceHTML.insertBefore(newChoiceElement, choiceHTML.firstChild);
}

function addChoiceValue(button) {
  var choiceValueHTML = button.parentNode.previousElementSibling.querySelector(".choice__choiceInfo__choiceValue");
  const newInputContainer = document.createElement('div');
  newInputContainer.classList.add('input-container');

  const newChoiceValueInput = document.createElement('input');
  newChoiceValueInput.type = 'text';
  newChoiceValueInput.name = 'choiceValue';
  newChoiceValueInput.classList.add('choice-value-input');
  newChoiceValueInput.placeholder = 'Giá trị';
  newChoiceValueInput.required = true;

  const removeButton = document.createElement('button');
  removeButton.textContent = 'x';
  removeButton.addEventListener('click', function () {
    newInputContainer.remove();
  });

  newInputContainer.appendChild(newChoiceValueInput);
  newInputContainer.appendChild(removeButton);


  choiceValueHTML.appendChild(newInputContainer);
}

function removeChoiceContainer(button) {
  const container = button.closest('.container__variant__choice');
  if (container) {
    container.remove();
    checkAndToggleChoiceVisibility();
  }
}

function removeValue(button) {
  const container = button.closest('.input-container');
  if (container) {
    container.remove();
    checkAndToggleChoiceVisibility();
  }
  const choiceValueContainer = document.querySelector('.choice__choiceInfo__choiceValue');
  if (choiceValueContainer && choiceValueContainer.innerHTML.trim() === '') {
    const choiceInfoContainer = choiceValueContainer.closest('.choice__choiceInfo');
    if (choiceInfoContainer) {
      choiceInfoContainer.remove();
    }
  }

};

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

  var removeButtonHTML = `
  <input type="text" name="priceChoice" placeholder="Giá cả" required="">
  <button class="remove-button" onclick="removeExceptionContainer(this)">x</button>`;
  addValueDiv.innerHTML = removeButtonHTML;

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

function removeExceptionContainer(button) {
  const container = button.closest('.container__exception__choice');
  if (container) {
    container.remove();
    checkAndToggleChoiceVisibility();
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


  var saleChoiceDiv = document.createElement("div");
  saleChoiceDiv.classList.add("choice__saleChoice");

  var saleNumberDiv = document.createElement("div");
  saleNumberDiv.classList.add("sale-infor");
  var saleNumberLabel = document.createElement("label");
  saleNumberLabel.setAttribute("for", "saleNumber");
  saleNumberLabel.textContent = "Giảm giá:";
  var saleNumberInput = document.createElement("input");
  saleNumberInput.type = "text";
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
  toDateInput.name = "toDate";
  toDateInput.required = true;
  toDateDiv.appendChild(toDateLabel);
  toDateDiv.appendChild(toDateInput);

  saleChoiceDiv.appendChild(saleNumberDiv);
  saleChoiceDiv.appendChild(startDateDiv);
  saleChoiceDiv.appendChild(toDateDiv);

  var removeValueDiv = document.createElement("div");
  removeValueDiv.classList.add("choice__addValue");
  var removeButtonHTML = '<button class="remove-button" onclick="removeSaleContainer(this)">x</button>';
  removeValueDiv.innerHTML = removeButtonHTML;


  saleDiv.appendChild(choiceInfoDiv);
  saleDiv.appendChild(saleChoiceDiv);
  saleDiv.appendChild(removeValueDiv);

  return saleDiv;
}


function addSaleForm() {
  var saleHTML = document.getElementById("sale");
  var newSaleElement = createSaleElement();
  saleHTML.insertBefore(newSaleElement, saleHTML.lastElementChild);
}
function removeSaleContainer(button) {
  const container = button.closest('.container__sale__choice');
  if (container) {
    container.remove();
    checkAndToggleChoiceVisibility();
  }
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
          const newInputContainer = document.createElement('div');
          newInputContainer.classList.add('input-container');

          const newChoiceValueInput = document.createElement('input');
          newChoiceValueInput.type = 'text';
          newChoiceValueInput.name = 'choiceValue';
          newChoiceValueInput.classList.add('choice-value-input');
          newChoiceValueInput.placeholder = 'Giá trị';
          newChoiceValueInput.value = choice.choiceValues[j];
          newChoiceValueInput.required = true;

          const removeButton = document.createElement('button');
          removeButton.textContent = 'x';
          removeButton.addEventListener('click', function () {
            const choiceInfo = removeButton.closest('.choice__choiceInfo');
            newInputContainer.remove();
            if (choiceInfo) {
              const choiceValue = choiceInfo.querySelector('.choice__choiceInfo__choiceValue');

              if (choiceValue.textContent.trim() === "") {
                const container = choiceInfo.closest('.container__variant__choice');
                if (container) {
                  container.remove();
                  checkAndToggleChoiceVisibility();
                }
              }
            }

          });

          newInputContainer.appendChild(newChoiceValueInput);
          newInputContainer.appendChild(removeButton);
          choiceValueDiv.appendChild(newInputContainer);
        }
        choiceDiv.appendChild(choiceValueDiv);

        var addChoiceDiv = document.createElement('div');
        addChoiceDiv.className = "choice__addValue"
        addChoiceDiv.innerHTML = `
            <button onclick="addChoiceValue(this)" class="plus-button">+</button>
            <button onclick="removeChoiceContainer(this)" class="remove-button">x</button>
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

        var addValueDiv = document.createElement("div");
        addValueDiv.classList.add("choice__addValue");

        var removeButtonHTML = `
          <input type="text" name="priceChoice" placeholder="Giá cả" value="${variant.price}" required="">
          <button class="remove-button" onclick="removeExceptionContainer(this)">x</button>`;
        addValueDiv.innerHTML = removeButtonHTML;

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


        var removeValueDiv = document.createElement("div");
        removeValueDiv.classList.add("choice__addValue");
        var removeButtonHTML = '<button class="remove-button" onclick="removeSaleContainer(this)">x</button>';
        removeValueDiv.innerHTML = removeButtonHTML;

        choiceSaleContainer.appendChild(saleChoiceDiv);
        choiceSaleContainer.appendChild(removeValueDiv);

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




//result of old product
console.log(choiceList)
console.log(variantList)
console.log(saleList)
console.log(selectedImages)
console.log(categoryOfProduct)

/* ----------------------------------------------XỬ LÝ REQUEST SỬA SẢN PHẨM---------------------------------------------- */
