var choiceList = []             //choiceName, choiceValues: [0: , 1: ]
var variantList = []     //100(Price) : [{choiceName, choiceValues: [0: , 1: ]} {choiceName, choiceValues: [0: , 1: ]}]
var saleList = []               //choices[0: {choiceName, choiceValue}, 1: ...] : sale{saleNumber, startDate, endDate}
var selectedImages = []
var categoryOfProduct = []
var imageFormData = new FormData();
var categoryData = [];


/* ----------------------------------------------KHỞI TẠO---------------------------------------------- */

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
    document.getElementById("showExceptionForm").style.display = 'none'
    document.getElementById("showChoice").style.display = 'block'
  }

  const containerException = document.querySelector('#exception .container__exception__choice');
  const exceptionContainer = document.querySelector('#exception');
  if (containerException) {
  } else {
    exceptionContainer.style.display = 'none';
    document.getElementById("exceptionTitle").style.display = 'none'
    document.getElementById("showExceptionForm").style.display = (choiceList.length > 0 && variantList.length == 0) ? 'block' : 'none'
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





/* ----------------------------------------------XỬ LÝ CÂY---------------------------------------------- */

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
  xhttp.open("GET", `${domain}/api/v1.0/Categories`, true);
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

function findAncestors(categoryId, categories) {
  const ancestors = [];

  function findInCategoryTree(categoryId, categoryList) {
    for (const category of categoryList) {
      if (category.id == categoryId) {
        return true;
      }
      if (category.children.length > 0 && findInCategoryTree(categoryId, category.children)) {
        ancestors.push(category.id);
        return true;
      }
    }
    return false;
  }

  findInCategoryTree(categoryId, categories);
  return ancestors;
}

//------------------ tick các category cũ

function tickCategoryInTree(categories) {

  categories.forEach(category => {
    document.querySelector(`.branch__checkbox[categoryid="${category.id}"]`).checked = true
    if (category.children.length > 0) {
      tickCategoryInTree(category.children);
    }
  });
}

function updateAndDisplay() {
  clearFieldErrors();
  const requiredFields = document.querySelectorAll('[required]');
  const requiredFieldsArray = Array.from(requiredFields);
  if (getAllCategory().length == 0) {
    requiredFieldsArray.push(document.getElementById("categoryTree"))
  }
  if (selectedImages.length == 0) {
    requiredFieldsArray.push(document.getElementById("image-input"))
  }
  var choiceInforDivs = document.querySelectorAll('.choice__choiceInfo')
  choiceInforDivs.forEach(choiceInforDiv => {
    var selectElements = choiceInforDiv.getElementsByTagName("select");
    var selectArray = Array.from(selectElements);
    selectArray.forEach(selectElement => {
      const selectedOptionIndex = selectElement.selectedIndex;;
      if (selectedOptionIndex == 0) {
        selectElement.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = 'Không để trống ô này.';
        selectElement.insertAdjacentElement('afterend', errorElement);
      }
    })
  })

  let allFieldsFilled = true;
  requiredFieldsArray.forEach(field => {
    if (!checkRequiredField(field)) {
      allFieldsFilled = false;
    }
  });

  if (!allFieldsFilled) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `
      <div class="notification-content">
          <p>Hãy điền đầy đủ thông tin</p>
          <button id="okButton">OK</button>
      </div>
    `;
    document.body.appendChild(notification);

    const okButton = document.getElementById('okButton');
    okButton.addEventListener('click', () => {
      document.body.removeChild(notification);
      overlay.style.display = 'none';
    });
    return;
  }
  choiceList = extractChoiceList()
  variantList = extractExceptions()
  saleList = extractSaleList()
  if (checkDuplicateChoicesWithDifferentPrices(variantList)) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `
      <div class="notification-content">
          <p>Có nhiều hơn 1 nhóm lựa chọn có nhiều giá. Vui lòng sửa</p>
          <button id="okButton">OK</button>
      </div>
    `;
    document.body.appendChild(notification);

    const okButton = document.getElementById('okButton');
    okButton.addEventListener('click', () => {
      document.body.removeChild(notification);
      overlay.style.display = 'none';
    });
    return
  }
  if (checkDuplicateChoicesWithDuplicateSale(saleList)) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `
      <div class="notification-content">
          <p>Nhóm lựa chọn có nhiều hơn 1 mã giám trong cùng thời điểm. Vui lòng sửa</p>
          <button id="okButton">OK</button>
      </div>
    `;
    document.body.appendChild(notification);

    const okButton = document.getElementById('okButton');
    okButton.addEventListener('click', () => {
      document.body.removeChild(notification);
      overlay.style.display = 'none';
    });
    return
  }
  console.log("lấy từ html")
  console.log(choiceList);
  console.log(variantList);
  console.log(saleList);

  variantList = filterVariantsByChoiceList(variantList, choiceList)
  saleList = filterSalesByChoiceList(saleList, choiceList)

  console.log("sau khi filter")
  console.log(choiceList);
  console.log(variantList);
  console.log(saleList);

  document.getElementById('sale').innerHTML = `<div class="container__variant__addChoice">
          <button id="showExceptionForm" onclick="addSaleForm()" class="addElement">Thêm mã giảm giá</button>
        </div>`
  document.getElementById('exception').innerHTML = `<div class="container__variant__addChoice">
          <button id="addExceptionForm" onclick="addExceptionForm()" class="addElement">Thêm ngoại lệ</button>
        </div>`

  displayException()
  displaySale()
  var variantsByChoiceList = generateCombinations(choiceList)
  if (variantsByChoiceList.length <= 1) {
    document.getElementById("showExceptionForm").style.display = 'none'
    document.getElementById("exceptionTitle").style.display = 'none'
    document.getElementById("exception").style.display = 'none'

  } else if (variantList.length < 1 && variantsByChoiceList.length > 1) {
    document.getElementById("showExceptionForm").style.display = 'block'
    document.getElementById("exceptionTitle").style.display = 'none'
    document.getElementById("exception").style.display = 'none'
  } else {
    document.getElementById("showExceptionForm").style.display = 'none'
    document.getElementById("exceptionTitle").style.display = 'block'
    document.getElementById("exception").style.display = 'flex'
  }


}

/* ----------------------------------------------XỬ LÝ ẢNH---------------------------------------------- */
const selectedImagesContainer = document.getElementById('selected-images');
const imageInput = document.getElementById('image-input');
const overlay = document.getElementById('overlay');
const overlayContent = document.getElementById('overlay-content');

async function fetchImageAsFile(imageUrl, fileType) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], `filename.${fileType}`);
    return file;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}


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
      const extension = file.name.split('.').pop();
      const imageElement = createImageElement(URL.createObjectURL(file), type);
      selectedImages.push({ url: imageElement.querySelector('img, video').src, extension: extension, type: type });
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
  var choiceContainers = document.getElementById("choice").querySelectorAll(".container__variant__choice")
  if (choiceContainers.length == 0) {
    addFormChoice()
  }
  var variantsByChoiceList = generateCombinations(choiceList);
  if (variantsByChoiceList.length > 1) {
    document.getElementById("showExceptionForm").style.display = 'inline-block'
  }
}

function displayChoice() {
  const choiceContainer = document.getElementById('choice');
  if (choiceList.length > 0) {
    document.getElementById("choiceTitle").style.display = 'inline-block'
    document.getElementById("choice").style.display = 'flex'
    document.getElementById("showChoice").style.display = 'none'
    var variantsByChoiceList = generateCombinations(choiceList);
    if (variantsByChoiceList.length > 1) {
      document.getElementById("showExceptionForm").style.display = 'inline-block'
    }
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
}

var choiceName_index = 0;

function addFormChoice() {
  choiceList = extractChoiceList()
  var variantsByChoiceList = generateCombinations(choiceList);
  console.log("variantsByChoiceList", variantsByChoiceList)
  if (variantsByChoiceList.length > 1) {
    document.getElementById("showExceptionForm").style.display = 'inline-block'
  }
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
  choiceList = extractChoiceList()
  console.log("choiceList", choiceList)
  var variantsByChoiceList = generateCombinations(choiceList);
  console.log("variantsByChoiceList", variantsByChoiceList)
  if (variantsByChoiceList.length > 1) {
    document.getElementById("showExceptionForm").style.display = 'inline-block'
  }
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
    updateAndDisplay()
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

//--------------------------cập nhật choiceList
function extractChoiceList() {
  const container = document.getElementById("choice")
  const choiceContainers = container.querySelectorAll('.container__variant__choice');

  const choiceList = [];

  choiceContainers.forEach(container => {
    const choiceNameInput = container.querySelector('.choice__choiceInfo__choiceName input');
    const choiceValueInputs = container.querySelectorAll('.choice-value-input');

    if (choiceNameInput && choiceValueInputs.length > 0) {
      const choiceName = choiceNameInput.value;
      const choiceValues = Array.from(choiceValueInputs).map(input => input.value);

      choiceList.push({
        choiceName: choiceName,
        choiceValues: choiceValues
      });
    }
  });

  return choiceList.sort((a, b) => a.choiceName.localeCompare(b.choiceName));
}

/* ----------------------------------------------XỬ LÝ NGOẠI LỆ---------------------------------------------- */
function showExceptionForm() {
  document.getElementById("exceptionTitle").style.display = 'inline-block'
  document.getElementById("exception").style.display = 'flex'
  document.getElementById("showExceptionForm").style.display = 'none'

  var exceptionContainers = document.getElementById("exception").querySelectorAll(".container__exception__choice")
  if (exceptionContainers.length == 0  && variantList.length == 0) {
    addExceptionForm()
  }
}

function displayException() {
  var exceptionContainer = document.getElementById('exception');

  if (variantList.length > 0) {
    showExceptionForm()
  } else {
    exceptionContainer.innerHTML = `<div class="container__variant__addChoice">
        <button id="addSaleForm" onclick="addExceptionForm()" class="addElement">Thêm ngoại lệ</button>
      </div>`
    checkAndToggleChoiceVisibility()
    document.getElementById("exceptionTitle").style.display = 'none'
    document.getElementById("exception").style.display = 'none'
    document.getElementById("showExceptionForm").style.display = 'block'
  }
  for (var i = 0; i < variantList.length; i++) {
    var variant = variantList[i];
    if (variant.price != document.getElementById('priceNoChoice').value) {
      var choiceExceptionContainer = document.createElement('div');
      choiceExceptionContainer.classList.add('container__exception__choice');

      var choiceInfoDiv = document.createElement('div');
      choiceInfoDiv.classList.add('choice__choiceInfo');

      for (var j = 0; j < choiceList.length; j++) {
        var choice = choiceList[j];
        var selectElement = document.createElement('select');
        selectElement.classList.add('select__exception');
        selectElement.required = true;
        var optionAll = document.createElement('option');
        optionAll.setAttribute('all', 'true');
        selectElement.setAttribute('choicename', choice.choiceName);
        optionAll.selected = true;
        optionAll.disabled = true;
        optionAll.textContent = `-- ${choice.choiceName} --`;
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
          <input type="number" name="priceChoice" placeholder="Giá cả" value="${variant.price}" required="">
          <button class="remove-button" onclick="removeExceptionContainer(this)">x</button>`;
      addValueDiv.innerHTML = removeButtonHTML;

      choiceExceptionContainer.appendChild(addValueDiv);
      exceptionContainer.insertBefore(choiceExceptionContainer, exceptionContainer.firstChild);
    }
  }
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
    selectElement.required = true;
    selectElement.setAttribute('choicename', choice.choiceName);
    var optionAll = document.createElement('option');
    optionAll.setAttribute('all', 'true');
    optionAll.selected = true;
    optionAll.disabled = true;
    optionAll.textContent = `-- ${choice.choiceName} --`;
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
  <input type="number" name="priceChoice" placeholder="Giá cả" required="">
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
    selectElement.required = true;
    var optionAll = document.createElement('option');
    selectElement.setAttribute('choicename', choice.choiceName);
    optionAll.setAttribute('all', 'true');
    optionAll.selected = true;
    optionAll.disabled = true;
    optionAll.textContent = `-- ${choice.choiceName} --`;
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

function filterVariantsByChoiceList(variants, choices) {
  return variants.map(variant => {
    const filteredChoices = variant.choices.filter(choicesSet => {
      return choicesSet.every(choice => {
        const matchingChoice = choices.find(c => c.choiceName === choice.choiceName);
        return matchingChoice && matchingChoice.choiceValues.includes(choice.choiceValue);
      });
    });

    return {
      price: variant.price,
      choices: filteredChoices
    };
  }).filter(variant => variant.choices.length > 0);
}

function extractExceptions() {
  const variants = [];

  const exceptionContainers = document.querySelectorAll('.container__exception__choice');

  exceptionContainers.forEach(exceptionContainer => {
    const choiceInfo = exceptionContainer.querySelector('.choice__choiceInfo');
    const selectElements = choiceInfo.querySelectorAll('select.select__exception');
    var choices = []
    const choice = Array.from(selectElements).map(select => ({
      choiceName: select.getAttribute('choicename'),
      choiceValue: select.value
    }));
    choices.push(choice)

    const addValueDiv = exceptionContainer.querySelector('.choice__addValue');
    const price = addValueDiv.querySelector('input[name="priceChoice"]')

    const variant = {
      choices: choices,
      price: price.value
    };

    variants.push(variant);
  });
  for (const variant of variants) {
    variant.choices.forEach(choiceGroup => {
      choiceGroup.sort((a, b) => a.choiceName.localeCompare(b.choiceName));
    });
  }

  return variants;
}


/* ----------------------------------------------XỬ LÝ MÃ GIẢM GIÁ---------------------------------------------- */

function showSaleForm() {
  document.getElementById("saleTitle").style.display = 'inline-block'
  document.getElementById("sale").style.display = 'flex'
  document.getElementById("showSaleForm").style.display = 'none'

  var saleContainers = document.getElementById("exception").querySelectorAll(".container__sale__choice")
  if (saleContainers.length == 0 && saleList.length == 0) {
    addSaleForm()
  }
}

function displaySale() {
  var saleContainer = document.getElementById('sale');
  if (saleList.length > 0) {
    document.getElementById("saleTitle").style.display = 'inline-block'
    document.getElementById("sale").style.display = 'flex'
    document.getElementById("showSaleForm").style.display = 'none'
  } else {
    saleContainer.innerHTML = `<div class="container__variant__addChoice">
      <button id="showSaleForm" onclick="addSaleForm()" class="addElement">Thêm mã giảm giá</button>
    </div>`
    checkAndToggleChoiceVisibility()
    document.getElementById("saleTitle").style.display = 'none'
    document.getElementById("sale").style.display = 'none'
    document.getElementById("showSaleForm").style.display = 'block'
  }
  for (var i = saleList.length - 1; i >= 0; i--) {
    var sale = saleList[i];
    var choiceSaleContainer = document.createElement('div');
    choiceSaleContainer.classList.add('container__sale__choice');

    var choiceInfoDiv = document.createElement('div');
    choiceInfoDiv.classList.add('choice__choiceInfo');

    for (var j = 0; j < choiceList.length; j++) {
      var choice = choiceList[j];
      var selectElement = document.createElement('select');
      selectElement.classList.add('select__exception');
      selectElement.required = true;
      var optionAll = document.createElement('option');
      selectElement.setAttribute('choicename', choice.choiceName);
      optionAll.setAttribute('all', 'true');
      optionAll.selected = true;
      optionAll.disabled = true;
      optionAll.textContent = `-- ${choice.choiceName} --`;
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
    const endDateInput = document.createElement("input");
    endDateInput.type = "datetime-local";
    endDateInput.name = "endDate";
    endDateInput.value = new Date(sale.sale.endDate).toISOString().slice(0, 16)
    endDateInput.required = true;

    const endDateLabel = document.createElement("label");
    endDateLabel.for = "endDate";
    endDateLabel.textContent = "Kết thúc:";
    saleInfo__endNumber.appendChild(endDateLabel);
    saleInfo__endNumber.appendChild(endDateInput);

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


  }
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
    selectElement.required = true;
    var optionAll = document.createElement('option');
    optionAll.setAttribute('all', 'true');
    selectElement.setAttribute('choiceName', choice.choiceName);
    optionAll.selected = true;
    optionAll.disabled = true;
    optionAll.textContent = `-- ${choice.choiceName} --`;
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

  var endDateDiv = document.createElement("div");
  endDateDiv.classList.add("sale-infor");
  var endDateLabel = document.createElement("label");
  endDateLabel.setAttribute("for", "endDate");
  endDateLabel.textContent = "Kết thúc:";
  var endDateInput = document.createElement("input");
  endDateInput.type = "datetime-local";
  endDateInput.name = "endDate";
  endDateInput.required = true;
  endDateDiv.appendChild(endDateLabel);
  endDateDiv.appendChild(endDateInput);

  saleChoiceDiv.appendChild(saleNumberDiv);
  saleChoiceDiv.appendChild(startDateDiv);
  saleChoiceDiv.appendChild(endDateDiv);

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

function filterSalesByChoiceList(sales, choices) {
  if (sales.length == 0) {
    return [];
  }
  const newSaleList = sales.filter(sale => {
    return sale.choices.every(choice => {
      return choices.some(c =>
        c.choiceName === choice.choiceName && c.choiceValues.includes(choice.choiceValue)
      );
    });
  });

  return newSaleList;
}

function extractSaleList() {
  const sales = [];

  const saleContainers = document.querySelectorAll('.container__sale__choice');

  saleContainers.forEach(saleContainer => {
    const choiceInfo = saleContainer.querySelector('.choice__choiceInfo');
    const selectElements = choiceInfo.querySelectorAll('select.select__exception');
    const choices = Array.from(selectElements).map(select => ({
      choiceName: select.getAttribute('choicename'),
      choiceValue: select.value
    }));

    const saleChoice = saleContainer.querySelector('.choice__saleChoice');
    const saleNumberInput = saleChoice.querySelector('input[name="saleNumber"]');
    const startDateInput = saleChoice.querySelector('input[name="startDate"]');
    const endDateInput = saleChoice.querySelector('input[name="endDate"]');

    const sale = {
      choices: choices.sort((a, b) => a.choiceName.localeCompare(b.choiceName)),
      sale: {
        saleNumber: parseFloat(saleNumberInput.value),
        startDate: new Date(startDateInput.value),
        endDate: new Date(endDateInput.value)
      }
    };

    sales.push(sale);
  });

  return sales;
}

/* ----------------------------------------------XỬ LÝ REQUEST HIỂN THỊ THÔNG TIN CŨ SẢN PHẨM---------------------------------------------- */


function viewProduct() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (xhttp.status == 200) {
      var ResponseJson = xhttp.responseText;
      var Response = JSON.parse(ResponseJson);

      for (var i = 0; i < Response.variantsDTO.length; i++) {
        const variant = Response.variantsDTO[i];

        //Add choiceList
        if (variant.choices) {
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
                choiceList.sort((a, b) => a.choiceName.localeCompare(b.choiceName))
              }
            }
          }
        }


        //Add variantList 
        const variantPrice = variant.originPrice;
        const variantChoices = variant.choices ? variant.choices.map(choice => {
          return {
            id: choice.id,
            choiceName: choice.choiceName,
            choiceValue: choice.choiceValue
          };
        }).sort((a, b) => a.choiceName.localeCompare(b.choiceName)) : [];

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
            const choices = variant.choices ? variant.choices.map(choice => {
              return {
                choiceName: choice.choiceName,
                choiceValue: choice.choiceValue
              };
            }) : [];

            saleList.push({
              choices: choices.sort((a, b) => a.choiceName.localeCompare(b.choiceName)),
              sale: {
                saleNumber: sale.numberSale,
                startDate: new Date(sale.startDate),
                endDate: new Date(sale.endDate)
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
      displayChoice()

      //exception 
      if (variantList.length == 1) {
        variantList = []
      }
      displayException()

      //sale
      displaySale()
      //image
      Response.image.forEach(file => {
        selectedImages.push({
          url: file.url,
          extension: file.url.split(".").pop(),
          type: file.type
        })
      })

      //category
      categoryOfProduct = Response.category
    } else if (xhttp.status == 204) {

    } else if (xhttp.status == 401) {
      localStorage.removeItem("Token");
      window.location = "/fe/login";
    } else if (xhttp.status == 403) {
      localStorage.removeItem("Token");
      window.location = "/fe/login";
    }
  }

  xhttp.open("GET", `${domain}/api/v1.0/ProductDetail/` + window.location.pathname.substring(17), false);

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

/* ----------------------------------------------VALIDATION---------------------------------------------- */
function checkRequiredField(field) {
  if (!field.value) {
    field.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = 'Không để trống ô này.';
    field.insertAdjacentElement('afterend', errorElement);
    return false;
  }

  return true;
}


function clearFieldErrors() {
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(error => error.remove());

  const errorFields = document.querySelectorAll('.error');
  errorFields.forEach(field => field.classList.remove('error'));
}

function checkDuplicateChoicesWithDifferentPrices(variants) {
  const seenChoices = new Map();
  const duplicateChoices = new Set();
  for (const variant of variants) {
    const choicesCopy = [...variant.choices];
    choicesCopy.forEach(choiceGroup => {
      choiceGroup.sort((a, b) => a.choiceName.localeCompare(b.choiceName));
    });

    const choicesStr = JSON.stringify(choicesCopy);

    if (seenChoices.has(choicesStr)) {
      if (seenChoices.get(choicesStr) !== variant.price) {
        duplicateChoices.add(choicesStr);
      }
    } else {
      seenChoices.set(choicesStr, variant.price);
    }
  }

  if (duplicateChoices.size > 0) {
    const duplicateChoicesList = document.getElementById('duplicateChoicesList');
    duplicateChoices.forEach(choicesStr => {
      const choices = JSON.parse(choicesStr);
      const listItem = document.createElement('li');
      listItem.textContent = choices.map(choice => `${choice.choiceName}: ${choice.choiceValue}`).join(', ');
      duplicateChoicesList.appendChild(listItem);
    });

    const duplicateChoicesAlert = document.getElementById('duplicateChoicesAlert');
    duplicateChoicesAlert.style.display = 'block';
  }
  return duplicateChoices.size > 0;
}


function checkDuplicateChoicesWithDuplicateSale(sales) {
  const seenChoices = new Map();
  const duplicateSales = new Map();
  const duplicateSalesList = [];

  for (const saleItem of sales) {
    const choicesKey = JSON.stringify(saleItem.choices);

    if (seenChoices.has(choicesKey)) {
      const existingSale = seenChoices.get(choicesKey);

      const newSaleStart = new Date(saleItem.sale.startDate).getTime();
      const newSaleEnd = new Date(saleItem.sale.endDate).getTime();

      const existingSaleStart = new Date(existingSale.sale.startDate).getTime();
      const existingSaleEnd = new Date(existingSale.sale.endDate).getTime();

      if (
        (newSaleStart >= existingSaleStart && newSaleStart <= existingSaleEnd) ||
        (newSaleEnd >= existingSaleStart && newSaleEnd <= existingSaleEnd)
      ) {
        if (!duplicateSales.has(choicesKey)) {
          duplicateSales.set(choicesKey, [existingSale.sale, saleItem.sale]);
        } else {
          duplicateSales.get(choicesKey).push(saleItem.sale);
        }
      }
    } else {
      seenChoices.set(choicesKey, saleItem);
    }
  }

  if (duplicateSales.size > 0) {
    const duplicateSalesListElement = document.getElementById('duplicateSalesList');
    duplicateSales.forEach((sales, choicesKey) => {
      const choices = JSON.parse(choicesKey);
      const listItem = document.createElement('li');
      listItem.textContent = choices.map(choice => `${choice.choiceName}: ${choice.choiceValue}`).join(', ');
      duplicateSalesListElement.appendChild(listItem);
    });

    const duplicateSalesAlert = document.getElementById('duplicateSalesAlert');
    duplicateSalesAlert.style.display = 'block';
  }
  return duplicateSales.size > 0;
}


/* ----------------------------------------------XỬ LÝ REQUEST SỬA SẢN PHẨM---------------------------------------------- */
//lấy toàn bộ category được selected
function getAllCategory() {
  const checkboxes = document.querySelectorAll('input.branch__checkbox:checked');
  const selectedCategories = [];

  checkboxes.forEach(checkbox => {
    const categoryId = checkbox.getAttribute('categoryid');
    selectedCategories.push(parseInt(categoryId));
  });

  return selectedCategories;
}

//tổng hợp variant
function generateCombinations(choiceList) {
  const result = [];

  function generate(index, currentCombination) {
    if (index === choiceList.length) {
      result.push([...currentCombination]);
      return;
    }

    for (const value of choiceList[index].choiceValues) {
      currentCombination.push({
        choiceName: choiceList[index].choiceName,
        choiceValue: value
      });
      generate(index + 1, currentCombination);
      currentCombination.pop();
    }
  }

  generate(0, []);

  return result;
}

async function editProduct() {
  //check validate
  clearFieldErrors();
  const requiredFields = document.querySelectorAll('[required]');
  const requiredFieldsArray = Array.from(requiredFields);
  if (getAllCategory().length == 0) {
    requiredFieldsArray.push(document.getElementById("categoryTree"))
  }
  if (selectedImages.length == 0) {
    requiredFieldsArray.push(document.getElementById("image-input"))
  }

  var choiceInforDivs = document.querySelectorAll('.choice__choiceInfo')
  choiceInforDivs.forEach(choiceInforDiv => {
    var selectElements = choiceInforDiv.getElementsByTagName("select");
    var selectArray = Array.from(selectElements);
    selectArray.forEach(selectElement => {
      const selectedOptionIndex = selectElement.selectedIndex;;
      if (selectedOptionIndex == 0) {
        selectElement.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = 'Không để trống ô này.';
        selectElement.insertAdjacentElement('afterend', errorElement);
      }
    })
  })

  let allFieldsFilled = true;
  requiredFieldsArray.forEach(field => {
    if (!checkRequiredField(field)) {
      allFieldsFilled = false;
    }
  });

  if (!allFieldsFilled) {
    overlay.style.display = 'block';

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `
      <div class="notification-content">
          <p>Hãy điền đầy đủ thông tin</p>
          <button id="okButton">OK</button>
      </div>
    `;
    document.body.appendChild(notification);

    const okButton = document.getElementById('okButton');
    okButton.addEventListener('click', () => {
      document.body.removeChild(notification);
      overlay.style.display = 'none';
    });

    return;
  }
  if (checkDuplicateChoicesWithDifferentPrices(variantList)) {
    overlay.style.display = 'block';

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `
      <div class="notification-content">
          <p>Có nhiều hơn 1 nhóm lựa chọn có nhiều giá. Vui lòng sửa</p>
          <button id="okButton">OK</button>
      </div>
    `;
    document.body.appendChild(notification);

    const okButton = document.getElementById('okButton');
    okButton.addEventListener('click', () => {
      document.body.removeChild(notification);
      overlay.style.display = 'none';
    });
    return;
  }
  if (checkDuplicateChoicesWithDuplicateSale(saleList)) {
    overlay.style.display = 'block';

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `
      <div class="notification-content">
          <p>Nhóm lựa chọn có nhiều hơn 1 mã giám trong cùng thời điểm. Vui lòng sửa</p>
          <button id="okButton">OK</button>
      </div>
    `;
    document.body.appendChild(notification);

    const okButton = document.getElementById('okButton');
    okButton.addEventListener('click', () => {
      document.body.removeChild(notification);
      overlay.style.display = 'none';
    });
    return;
  }

  updateAndDisplay()

  //----------------------------Lấy category----------------------------------//
  var categoryRequestHTML = getAllCategory();
  var categoryRequest = categoryRequestHTML.slice();
  for (var i = 0; i < categoryRequestHTML.length; i++) {
    var ancestors = findAncestors(categoryRequestHTML[i], categoryData);
    for (var j = 0; j < ancestors.length; j++) {
      const index = categoryRequest.indexOf(ancestors[j]);
      if (index !== -1) {
        categoryRequest.splice(index, 1);
      }
    }
  }
  console.log(categoryRequest)


  //----------------------------Lấy variant----------------------------------//
  var variantsByChoiceList = generateCombinations(choiceList)
  console.log(variantsByChoiceList)
  var variantsRequest = []
  for (var i = 0; i < variantsByChoiceList.length; i++) {
    var choicesRequest = variantsByChoiceList[i]; //lấy choice của variantsByChoiceList thứ i
    var hasVariant = false

    var priceOfVariant = document.getElementById("priceNoChoice").value;
    for (const entry of variantList) {
      const choices = entry.choices.flat();
      const matchingChoicesException = choicesRequest.every(choice => {
        return choices.some(c => c.choiceName === choice.choiceName && c.choiceValue === choice.choiceValue);
      });
      priceOfVariant = matchingChoicesException ? entry.price : document.getElementById("priceNoChoice").value;
    }

    const matchingSales = [];
    for (const saleItem of saleList) {
      const matchingChoices = saleItem.choices.every(saleChoice => {
        return choicesRequest.some(variantChoice =>
          variantChoice.choiceName === saleChoice.choiceName &&
          variantChoice.choiceValue === saleChoice.choiceValue
        );
      });

      if (matchingChoices) {
        matchingSales.push({
          numberSale: saleItem.sale.saleNumber,
          startDate: saleItem.sale.startDate.toISOString().replace('.000Z', ''),
          endDate: saleItem.sale.endDate.toISOString().replace('.000Z', '')
        });
      }
    }

    variantsRequest.push({
      originPrice: priceOfVariant,
      choices: choicesRequest,
      sale: matchingSales.length > 0 ? matchingSales : null
    })
    console.log("variantsDTO", variantsRequest)
  }

  //thực hiện gửi request

  console.log("gửi")

  //gửi request
  const xhttp = new XMLHttpRequest();
  var formData = new FormData();
  formData.append('productName', document.getElementById('info__productName').value)
  formData.append('productCode', document.getElementById('info__productCode').value)
  formData.append('description', document.getElementById('description').value)

  const imageFile = []
  const imageFormData = new FormData();

  for (const imageInfo of selectedImages) {
    const imageUrl = imageInfo.url;
    const fileType = imageInfo.extension;

    const file = await fetchImageAsFile(imageUrl, fileType);

    if (file) {
      imageFile.push(file);
    }
  }
  console.log("imageFile", imageFile);
  imageFile.forEach(file => {
    formData.append('image', file); // Thêm đối tượng File vào FormData
  });
  const imageValues = formData.getAll('image');
  console.log("imageValues", imageValues);

  formData.append('categoryId', categoryRequest)

  variantsRequest.forEach((item, index) => {
    formData.append(`variantsDTO[${index}].originPrice`, item.originPrice);

    item.choices.forEach((choice, choiceIndex) => {
      formData.append(`variantsDTO[${index}].choices[${choiceIndex}].choiceName`, choice.choiceName);
      formData.append(`variantsDTO[${index}].choices[${choiceIndex}].choiceValue`, choice.choiceValue);
    });

    if (item.sale) {
      item.sale.forEach((sale, saleIndex) => {
        formData.append(`variantsDTO[${index}].sale[${saleIndex}].numberSale`, sale.numberSale);
        formData.append(`variantsDTO[${index}].sale[${saleIndex}].startDate`, sale.startDate);
        formData.append(`variantsDTO[${index}].sale[${saleIndex}].endDate`, sale.endDate);
      });
    }
  });

  console.log(formData.getAll('variantsDTO[0].originPrice'));
  console.log(formData.getAll('variantsDTO[0].sale[0].numberSale'));

  xhttp.onload = function () {
    if (xhttp.status === 200) {
      var ResponseJson = xhttp.responseText;
      var Response = JSON.parse(ResponseJson)

      function showSuccessNotification(message) {
        overlay.style.display = 'block';

        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = `
                <div class="notification-content">
                    <p>Bạn đã sửa sản phẩm ${message} thành công</p>
                    <button id="okButton">OK</button>
                </div>
            `;
        document.body.appendChild(notification);

        const okButton = document.getElementById('okButton');
        okButton.addEventListener('click', () => {
          document.body.removeChild(notification);
          overlay.style.display = 'none';
          window.location = '/fe/product/viewAll';
        });
      }
      showSuccessNotification(document.getElementById('info__productName').value)
    } else if (xhttp.status === 403) {
      //window.location = '/fe/login';
    } else if (xhttp.status === 400) {
      var ResponseJson = xhttp.responseText
      var Response = JSON.parse(ResponseJson)
      if (Response.messages == "Product Code is existed"){
        var field = document.getElementById("info__productCode")
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = 'Mã sản phẩm bị trùng. Vui lòng chọn lại';
        field.insertAdjacentElement('afterend', errorElement);
        return;
      }
    } else {
      var ResponseJson = xhttp.responseText
      var Response = JSON.parse(ResponseJson)
      alert(Response);
      alert(Response.messages);
    }
  }
  xhttp.open('PUT', `${domain}/api/v1.0/ProductDetail/` + window.location.pathname.substring(17), true);
  var jwtToken = localStorage.getItem("Token");
  xhttp.setRequestHeader('Authorization', 'Bearer ' + jwtToken);

  xhttp.send(formData);

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