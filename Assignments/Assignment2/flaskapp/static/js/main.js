// @ts-nocheck
// gpt credits
// Constants;
const API_ENDPOINT = "http://127.0.0.1:5000";
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

  document.getElementById("sumc").insertAdjacentHTML(
    "beforeend",
    change < 0
      ? `<div style="display:flex; align-items:center;gap:5px">
      <p >${change}</p>
  <img src="static/assets/RedArrowDown.png" width="15px" height="15px" />
</div>`
      : `<div style="display:flex; align-items:center;gap:5px">
      <p >${change}</p>
<img src="static/assets/GreenArrowUp.png" width="15px" height="15px" />
</div>`
  );
  document.getElementById("sumcp").insertAdjacentHTML(
    "beforeend",
    change < 0
      ? `<div style="display:flex; align-items:center;gap:5px">
      <p >${changep}</p>
  <img src="static/assets/RedArrowDown.png" width="15px" height="15px" />
</div>`
      : `<div style="display:flex;align-items:center;gap:5px">
      <p >${changep}</p>
<img src="static/assets/GreenArrowUp.png" width="15px" height="15px" />
</div>`
  );

  document.getElementById("sumsts").innerHTML = ticker;

  const recommendationElements = `<div>
  <div style="display: flex; gap: 10px; align-items: center">
    <p
      class="recom-ind"
      style="color: red; margin-right: 10px; font-weight: 400"
    >
      Strong Sell
    </p>
    <div style="display: flex; align-items: center">
      <div class="r-tile" style="background-color: rgb(220, 63, 65)">
        ${recommendationData["strongSell"]}
      </div>
      <div class="r-tile" style="background-color: rgb(167, 100, 80)">
        ${recommendationData["sell"]}
      </div>
      <div class="r-tile" style="background-color: rgb(126, 146, 100)">
        ${recommendationData["hold"]}
      </div>
      <div class="r-tile" style="background-color: rgb(105, 199, 119)">
        ${recommendationData["buy"]}
      </div>
      <div class="r-tile" style="background-color: rgb(117, 251, 141)">
        ${recommendationData["strongBuy"]}
      </div>
    </div>
    <p
      style="color: green; margin-left: 10px; font-weight: 400"
      class="recom-ind"
    >
      Strong Buy
    </p>
  </div>
  <p style="color:black;font-weight:400">Recommendation Trends</p>
</div>
`;

  document
    .getElementById("recommendation-container")
    .insertAdjacentHTML("beforeend", recommendationElements);
}

function setChartsTab(chartsData, ticker) {
  const chart1Data = [];
  const chart2Data = [];
  let max_volume = 0;
  for (const charObj of chartsData) {
    chart1Data.push([charObj["t"], charObj["c"]]);
    chart2Data.push([charObj["t"], charObj["v"]]);
    if (charObj["v"] > max_volume) {
      max_volume = charObj["v"];
    }
  }
  var date = new Date();
  var utcDate = new Date(date.toUTCString());
  utcDate.setHours(utcDate.getHours() - 8);
  var usDate = new Date(utcDate);
  const CHART_HEADER_DATE_STRING = `Stock Price ${ticker.toUpperCase()} ${usDate
    .toISOString()
    .slice(0, 10)}`;

  const MAX_VOLUME = max_volume;
  Highcharts.stockChart("container", {
    title: {
      text: CHART_HEADER_DATE_STRING,
    },
    subtitle: {
      text: '<a href="https://polygon.io"  style="text-decoration: underline; color: blue;" onmouseover="this.style.textDecoration="underline overline"; this.style.color="red";" onmouseout="this.style.textDecoration="underline"; this.style.color="blue";" target="_blank" >Source: Polygon.io</a>',
    },
    chart: {
      spacingLeft: 0,
      spacingRight: 0,
      alignTicks: true,
      height: 400,
    },

    rangeSelector: {
      selected: 0,
      inputEnabled: false,
      buttons: [
        { text: "7d", type: "day", count: 7 },
        { text: "15d", type: "day", count: 15 },
        { text: "1m", type: "month", count: 1 },
        { text: "3m", type: "month", count: 3 },
        { text: "6m", type: "month", count: 6 },
      ],
    },
    xAis: {
      minPadding: 0,
    },
    yAxis: [
      {
        opposite: false,

        labels: {
          align: "right",
          x: -5,
        },
        title: {
          text: "Stock Price",
        },
        lineWidth: 0,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: "left",
          x: 3,
        },
        title: {
          text: "Volume",
        },
        max: 2 * MAX_VOLUME,
        offset: 0,
        lineWidth: 0,
        tickPosition: "inside",
      },
    ],
    plotOptions: {
      series: {
        pointPlacement: "on",
      },
    },
    series: [
      {
        type: "area",
        name: "Stock Price",
        data: chart1Data,
        threshold: null,
        yAxis: 0,
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors[0])
                .setOpacity(0)
                .get("rgba"),
            ],
          ],
        },
      },
      {
        type: "column",
        name: "Volume",
        data: chart2Data,
        color: "black",
        yAxis: 1,
        pointWidth: 5,
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
  ).format(new Date(newsData["datetime"] * 1000))}</p>
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
          const promises = urls.map((url) =>
            fetch(`${url}?ticker=${data["ticker"]}`)
          );

          Promise.all(promises)
            .then((responses) =>
              Promise.all(responses.map((response) => response.json()))
            )
            .then((data2) => {
              // Hydrate all tabs
              setChartsTab(data2[0], data["ticker"]);
              setNewsTab(data2[3]);
              setStockSummaryTab(data2[2], data2[1], data["ticker"]);
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

function handlePage(event) {
  if (event.keyCode === 8) {
    document.getElementById("tab-group").classList.remove("active");
    document.getElementById("tab-page-group").classList.remove("active");
    document.getElementById("notfound").classList.remove("active");
  }
}
