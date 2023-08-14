let choiceValues = [];
let currentChoiceValueTab;
let currentTabSale;
let salesData = [];

initChoiceValue();

function initChoiceValue() {
  currentChoiceValueTab = 1;
  salesData = []
  currentTabSale = 0;
  document.getElementById("choice").style.display = "none";
}

function showFormChoice() {
  document.getElementById("choice").style.display = "flex";
  document.getElementById("showChoice").style.display = "none";
  document.getElementById("sale").style.display = "none";
  document.getElementById("priceNoChoicePart").style.display = "none";
}

function showFormChoiceValue() {
  saveChoiceValue();//lưu choice hiện tại

  //khởi tạo choice mới
  salesData = []
  currentTabSale = 0;
  currentChoiceValueTab = choiceValues.length
  var choiceValueHTML = document.getElementById("choiceValueForm");
  var choiceTabs = document.getElementById("choiceTabs");

  choiceTabs.innerHTML += `<button onclick = "goToChoiceValueTab(` + (currentChoiceValueTab + 1) + `)" class="active">Loại ` + (currentChoiceValueTab + 1) + `</button>`;
  choiceValueHTML.innerHTML = `
    <div class="choiceValue__tabs">
          <div class="tab-number-choiceValue">
            <div id="choiceTabs">
            ${choiceTabs.innerHTML}
            </div>
            <button onclick="showFormChoiceValue()" class="active add-choice">
              Thêm loại
            </button>
          </div>
          <div id= "tabChoiceValueName" class="tab-name-choiceValue">
            <label for="choiceValue">Loại:</label>
            <input type="text" id="choiceValue" name="choiceValue" placeholder="Vd: Đỏ" required />
            <label for="price">Giá cả:</label>
            <input type="text" id="price" name="price" placeholder="Vd: 15000" required />
          </div>
        </div>
        <div class="choiceValue__content">
          <div id="sales" class="choiceValue__sale">
            <div id="tabs" class="sale-tab">
              <!-- <button onclick="goToPage(1)" class="activeSale" data-page="1">Mã giảm giá 0</button> -->
            </div>
            <div id="sale" class="sale-off">
              <div class="sale-infor">
                <label for="saleNumber">Phần trăm giảm giá:</label>
                <input type="text" id="saleNumber" name="saleNumber" placeholder="Vd: 50" required />%
              </div>
              <div class="sale-date">
                <label for="fromDate">Thời gian bắt đầu giảm giá:</label>
                <input type="datetime-local" id="fromDate" name="fromDate" required />
                <label for="toDate">Thời gian kết thúc giảm giá:</label>
                <input type="datetime-local" id="toDate" name="toDate" required />
              </div>
            </div>
          </div>
          <div class="choiceValue__add">
            <button onclick="showFormSale()">Thêm mã giảm giá</button>
          </div>
        </div>
    `;
  currentChoiceValueTab = choiceValues.length + 1;
  document.getElementById("sale").style.display = "none";
}

function goToChoiceValueTab(tab) {
    //lưu current tab
  saveChoiceValue();

  //navigate next
  currentChoiceValueTab = tab
  // gán sales trong choiceValues cho salesData
  const salesFieldExists = choiceValues[currentChoiceValueTab - 1] && choiceValues[currentChoiceValueTab - 1].sales;

  if (salesFieldExists){
    salesData = choiceValues[currentChoiceValueTab - 1].sales
    currentTabSale = 0
  }
  else{
    salesData = []
    currentTabSale = 0
  }
  

  var tabChoiceValueNameHTML = document.getElementById("tabChoiceValueName");

  tabChoiceValueNameHTML.innerHTML = `<label for="choiceValue">Loại:</label>
  <input type="text" id="choiceValue" name="choiceValue" value="${choiceValues[tab - 1].choiceValue}" placeholder="Vd: Đỏ" required />
  <label for="price">Giá cả:</label>
  <input type="text" id="price" name="price" value="${choiceValues[tab - 1].price}" placeholder="Vd: 15000" required />`

  var salesHTML = document.getElementById('sales');
  var tabsSaleHTML = document.getElementById('tabs');

  if (salesFieldExists) {
    tabsSaleHTML.innerHTML = '';
    for (var current = 0; current < choiceValues[tab - 1].sales.length; current++) {
      tabsSaleHTML.innerHTML += `<button onclick="goToSalePage(${current + 1})" data-page="` + (current) + `" class="activeSale">Mã giảm giá ${current + 1}</button>`;
    }

    salesHTML.innerHTML = `
    <div id="tabs" class="sale-tab">
      ${tabsSaleHTML.innerHTML}
    </div>
    <div id="sale" class="sale-off">
      <div class="sale-infor">
        <label for="saleNumber">Phần trăm giảm giá:</label>
        <input type="text" id="saleNumber" name="saleNumber" value="${choiceValues[tab - 1].sales[0].saleNumber}" placeholder="Vd: 50" required />%
      </div>
      <div class="sale-date">
        <label for="fromDate">Thời gian bắt đầu giảm giá:</label>
        <input type="datetime-local" id="fromDate" name="fromDate" value="${choiceValues[tab - 1].sales[0].fromDate}" required />
        <label for="toDate">Thời gian kết thúc giảm giá:</label>
        <input type="datetime-local" id="toDate" name="toDate" value="${choiceValues[tab - 1].sales[0].toDate}" required />
      </div>
    </div>`;
    salesHTML.style.display = 'flex';
  } else {
    tabsSaleHTML.innerHTML = ""
    salesHTML.style.display = 'none';
  }

}

function saveChoiceValue() {
  const choiceValueName = document.getElementById("choiceValue").value;
  const price = document.getElementById("price").value;
  
  saveSale();

  console.log("salesData trong saveChoiceValue(): ")
  console.log(salesData)
  var choiceValue = {
    choiceValue: choiceValueName,
    price: price,
    sales: salesData.length > 0 ? salesData : null
  };


  choiceValues[currentChoiceValueTab - 1] = choiceValue

  console.log("choiceValues")
  console.log(choiceValues)
}


//xử lý sale
function showFormSale() {
  saveChoiceValue()
  document.getElementById("sales").style.display="flex";
  var saleHTML = document.getElementById('sale')

  saleHTML.innerHTML = `<div class="sale-off">
      <div class="sale-infor">
          <label for="saleNumber">Phần trăm giảm giá:</label>
          <input type="text" id="saleNumber" name="saleNumber" placeholder="Vd: 50" required />%
      </div>
      <div class="sale-date">
          <label for="fromDate">Thời gian bắt đầu giảm giá:</label>
          <input type="datetime-local" id="fromDate" name="fromDate" required />
          <label for="toDate">Thời gian kết thúc giảm giá:</label>
          <input type="datetime-local" id="toDate" name="toDate" required />
      </div>
  </div>
`;

  var tabSaleHTML = document.getElementById('tabs')
  currentTabSale = salesData.length + 1
  tabSaleHTML.innerHTML += `<button onclick="goToSalePage(` + (currentTabSale) + `)" data-page="` + (currentTabSale) + `" class="activeSale">Mã giảm giá ` + (currentTabSale) + `</button>`
  document.getElementById('sale').style.display = 'flex'
}

function goToSalePage(tab) {
  salesData = choiceValues[currentChoiceValueTab - 1].sales
  saveChoiceValue();
  currentTabSale = tab
  var saleHTML = document.getElementById('sale')
  
  saleHTML.innerHTML = `<div id="sale" class="sale-off">
      <div class="sale-infor">
          <label for="saleNumber">Phần trăm giảm giá:</label>
          <input type="text" id="saleNumber" name="saleNumber" value="${choiceValues[currentChoiceValueTab - 1].sales[tab - 1].saleNumber}" placeholder="Vd: 50" required />%
      </div>
      <div class="sale-date">
          <label for="fromDate">Thời gian bắt đầu giảm giá:</label>
          <input type="datetime-local" id="fromDate" name="fromDate" value="${choiceValues[currentChoiceValueTab - 1].sales[tab - 1].fromDate}" required />
          <label for="toDate">Thời gian kết thúc giảm giá:</label>
          <input type="datetime-local" id="toDate" name="toDate" value="${choiceValues[currentChoiceValueTab - 1].sales[tab - 1].toDate}" required />
      </div>
  </div>`

}

function saveSale() {


  const saleNumber = document.getElementById("saleNumber");
  const fromDate = document.getElementById("fromDate");
  const toDate = document.getElementById("toDate");

  if (!saleNumber && !fromDate && !toDate) {
    return
  }
  const sale = {
    saleNumber: saleNumber.value,
    fromDate: fromDate.value,
    toDate: toDate.value
  }

  salesData[currentTabSale - 1] = sale


  // Loại bỏ phần tử có chỉ số -1 khỏi mảng salesData
  salesData = salesData.filter(item => item.saleNumber !== '')

}


