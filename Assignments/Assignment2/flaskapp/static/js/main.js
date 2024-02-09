// @ts-nocheck
// gpt credits
function tabController(event, tabId) {
  let tabs = document.getElementsByClassName("tab");
  let tabPage = document.getElementsByClassName("tabpage");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
    tabPage[i].classList.remove("active");
  }
  document.getElementById(tabId)?.classList.add("active");
  event.currentTarget.classList.add("active");
}

function setCompanyTab(companyData) {
  const mappedObj = {
    cname: companyData.name,
    cticker: companyData.ticker,
    sec: companyData.exchange,
    sd: companyData.ipo,
    cat: companyData.finnhubIndustry,
  };

  const mappedkeys = ["cname", "cticker", "sec", "sd", "cat"];
  for (const key of mappedkeys) {
    document.getElementById(key).innerHTML = mappedObj[key];
  }
  document.getElementById("cimage").src = companyData["logo"];
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
  fetch(`http://127.0.0.1:5000/company-data?ticker=${ticker}`)
    .then((response) => {
      console.log("here");
      response.json().then(function (data) {
        if (data.hasOwnProperty("Error")) {
          document.getElementById("notfound").classList.add("active");
        } else {
          document.getElementById("tab-group").classList.add("active");
          document.getElementById("company-tab-page").classList.add("active");
          setCompanyTab(data);
          document.getElementById("company-tab").classList.add("active");
          document.getElementById("tab-page-group").classList.add("active");
        }
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
