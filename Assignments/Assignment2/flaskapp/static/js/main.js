// @ts-nocheck
// gpt credits
// Constants;
const API_ENDPOINT = "http://127.0.0.1";
const companyMappedObj = {
  cname: "name",
  cticker: "ticker",
  sec: "exchange",
  sd: "ipo",
  cat: "finnhubIndustry",
};
const options = {
  year: "numeric", // Full numeric representation of the year (e.g., 2024)
  month: "long", // Full name of the month (e.g., February)
  day: "numeric", // Day of the month (e.g., 8)
};
const summaryMappedObj = {
  sumpcp: "pc",
  sumop: "o",
  sumhp: "h",
  sumlp: "l",
};
const recommendationDataKeys = [
  "strongSell",
  "sell",
  "hold",
  "buy",
  "strongBuy",
];

// TODO: Chart cofig

function tabController(tabId) {
  const tabPageId = tabId + "-page";
  let tabs = document.getElementsByClassName("tab");
  let tabPage = document.getElementsByClassName("tabpage");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
    tabPage[i].classList.remove("active");
  }
  document.getElementById(tabPageId)?.classList.add("active");
  document.getElementById(tabId).classList.add("active");
}

function cleanup(element) {
  element.textContent = "";
}

function setCompanyTab(companyData) {
  for (const key of Object.keys(companyMappedObj)) {
    document.getElementById(key).innerHTML = companyData[companyMappedObj[key]];
  }
  document.getElementById("cimage").src = companyData["logo"];
}

function setStockSummaryTab(recommendationData, stockSummaryData, ticker) {
  // #cleanup
  const sumc = document.getElementById("sumc");
  const sumcp = document.getElementById("sumcp");
  const recommendationContainer = document.getElementById(
    "recommendation-container"
  );

  sumc.textContent = "";
  sumcp.textContent = "";
  recommendationContainer.textContent = "";
  for (const key of Object.keys(summaryMappedObj)) {
    document.getElementById(key).innerHTML =
      stockSummaryData[summaryMappedObj[key]];
  }
  document.getElementById("sumsts").innerHTML = ticker;
  document.getElementById("sumtd").innerHTML = new Intl.DateTimeFormat(
    "en-US",
    options
  ).format(new Date(stockSummaryData["t"] * 1000));

  const change = stockSummaryData["d"];
  const changep = stockSummaryData["dp"];

  // TODO: 0 case
  //TODO: Extra Cleanup if same tab is allowed
  document.getElementById("sumc").insertAdjacentHTML(
    "beforeend",
    change < 0
      ? `<div style="display:flex; align-items:center;gap:10px">
      <p class="colborder">${change}</p>
  <img src="static/assets/RedArrowDown.png" width="10px" height="10px" />
</div>`
      : `<div style="display:flex; align-items:center;gap:10px">
      <p class="colborder">${change}</p>
<img src="static/assets/GreenArrowUp.png" width="10px" height="10px" />
</div>`
  );
  document.getElementById("sumcp").insertAdjacentHTML(
    "beforeend",
    change < 0
      ? `<div style="display:flex; align-items:center;gap:10px">
      <p class="colborder">${changep}</p>
  <img src="static/assets/RedArrowDown.png" width="10px" height="10px" />
</div>`
      : `<div style="display:flex;align-items:center;gap:10px">
      <p class="colborder">${changep}</p>
<img src="static/assets/GreenArrowUp.png" width="10px" height="10px" />
</div>`
  );

  document.getElementById("sumsts").innerHTML = ticker;

  const recommendationElements = `<p style="color:red">Strong Sell</p><div class="r-tile" style="background-color: rgb(220, 63, 65)">${recommendationData["strongSell"]}</div>
  <div class="r-tile" style="background-color: rgb(167, 100, 80)">${recommendationData["sell"]}</div>
  <div class="r-tile" style="background-color: rgb(126, 146, 100)">${recommendationData["hold"]}</div>
  <div class="r-tile" style="background-color: rgb(105, 199, 119)">${recommendationData["buy"]}</div>
  <div class="r-tile" style="background-color: rgb(117, 251, 141)">${recommendationData["strongBuy"]}</div><p style="color:green">Strong Buy</p>`;

  document
    .getElementById("recommendation-container")
    .insertAdjacentHTML("beforeend", recommendationElements);
}

function setChartsTab(chartsData) {
  const chart1Data = [];
  const chart2Data = [];

  for (const charObj of chartsData) {
    chart1Data.push([charObj["t"], charObj["c"]]);
    chart2Data.push([charObj["t"], charObj["v"]]);
  }
  Highcharts.stockChart("container", {
    rangeSelector: {
      selected: 1,
    },
    yAxis: [
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "OHLC",
        },
        height: "60%",
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "Volume",
        },
        top: "65%",
        height: "35%",
        offset: 0,
        lineWidth: 2,
      },
    ],
    series: [
      {
        type: "area",
        name: "Stock Price",
        data: chart1Data,
      },
      {
        type: "candlestick",
        name: "Volume",
        data: chart2Data,
        yAxis: 1,
      },
    ],
  });
}
function getNewsCard(newsData, index) {
  //GPT Credit

  const component = `<div class="newsCard">
  <img id=${"nlink" + index} src=${
    newsData["image"]
  } width="100px" height="100px" alt="News Image" />
  <div>
    <p  class="news-headline" id=${"ntitle" + index}>${newsData["headline"]}</p>
    <p  class="news-date" id=${"ndate" + index}>${new Intl.DateTimeFormat(
    "en-US",
    options
  ).format(new Date(newsData["datetime"]))}</p>
    <a id=${"nlink" + index} href="${
    newsData["url"]
  }" target="_blank" rel="noopener noreferrer">See Original Post</a>
  </div>
</div>`;
  return component;
}
function setNewsTab(newsData) {
  const newstabpage = document.getElementById("news-tab-page");
  cleanup(newstabpage);
  for (let i = 0; i < 5; i++) {
    newstabpage.insertAdjacentHTML("beforeend", getNewsCard(newsData[i], i));
  }
}

function clearSearch() {
  document.getElementById("ticker").value = "";
  document.getElementById("tab-group").classList.remove("active");
  document.getElementById("tab-page-group").classList.remove("active");
  document.getElementById("notfound").classList.remove("active");
}

function search(event) {
  event.preventDefault();
  const ticker =
    document.getElementById("ticker").value === null
      ? ""
      : document.getElementById("ticker").value;
  fetch(`${API_ENDPOINT}/company-data?ticker=${ticker}`)
    .then((response) => {
      response.json().then(function (data) {
        if (data.hasOwnProperty("Error")) {
          document.getElementById("tab-group").classList.remove("active");
          document.getElementById("tab-page-group").classList.remove("active");
          document.getElementById("notfound").classList.add("active");
        } else {
          const urls = [
            "/chart-data",
            "/stock-summary",
            "/recommendation-trends",
            "/company-news",
          ];
          document.getElementById("notfound").classList.remove("active");
          document.getElementById("tab-group").classList.add("active");

          setCompanyTab(data);
          tabController("company-tab");
          //   Fetch all tabs and push  post rendering company data
          const promises = urls.map((url) => fetch(`${url}?ticker=${ticker}`));

          Promise.all(promises)
            .then((responses) =>
              Promise.all(responses.map((response) => response.json()))
            )
            .then((data) => {
              // Hydrate all tabs
              setChartsTab(data[0]);
              setNewsTab(data[3]);
              setStockSummaryTab(data[2], data[1], ticker);
            })
            .catch((error) => {
              console.error(error);
            });
          document.getElementById("tab-page-group").classList.add("active");
        }
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
