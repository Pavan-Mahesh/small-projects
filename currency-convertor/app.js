const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2025.3.26/v1/currencies/";

let data;
let rate;

window.addEventListener("load", () => {
  getData().then((jsonData) => {
    data = jsonData[selectList[0].value.toLowerCase()];
    setRate();
  });
});

const selectList = document.querySelectorAll(".dropdown select");
const inputList = document.querySelectorAll("input.amount");
const infoElem = document.querySelector(".info");

selectList.forEach((select) => {
  for (let currencyCode in countryList) {
    let newOption = document.createElement("option");
    newOption.textContent = currencyCode;

    if (
      (currencyCode === "INR" && select.id === "first") ||
      (currencyCode === "JPY" && select.id === "second")
    )
      newOption.selected = true;

    select.appendChild(newOption);
  }

  updateFlag(select);

  select.addEventListener("change", async (event) => {
    const selectElem = event.target;

    updateFlag(selectElem);

    if (selectElem.id === "first") {
      await getData().then((jsonData) => {
        data = jsonData[selectList[0].value.toLowerCase()];
      });
    }
    setRate();
  });
});

inputList.forEach((input) => {
  input.addEventListener("input", (event) => {
    const eventInputElem = event.target;
    const otherInputElem =
      eventInputElem.id === "one" ? inputList[1] : inputList[0];

    const value = eventInputElem.value;
    if (value === "" || value.includes("e") || value.includes("-")) {
      otherInputElem.value = "";
      return;
    }

    const newVal = parseFloat(value);
    const calcVal = eventInputElem.id === "one" ? newVal * rate : newVal / rate;

    otherInputElem.value = isNaN(calcVal)
      ? ""
      : calcVal < 0.1
      ? calcVal.toFixed(3)
      : calcVal.toFixed(2);
  });
});

function updateFlag(elem) {
  const currencyCode = elem.value;
  const countryCode = countryList[currencyCode];
  const newSrc = `https://flagsapi.com/${countryCode}/shiny/32.png`;

  const imgElem = elem.parentElement.querySelector("img.flag");
  imgElem.src = newSrc;
}

// the fetching process

async function getData() {
  inputList[0].value = "";
  inputList[1].value = "";

  infoElem.firstElementChild.textContent = "--";
  infoElem.lastElementChild.textContent = "--";

  let response = await fetch(
    BASE_URL + `${selectList[0].value.toLowerCase()}.json`
  );
  return await response.json();
}

function setRate() {
  rate = data[selectList[1].value.toLowerCase()];

  inputList[0].value = "1";
  inputList[1].value = rate < 0.1 ? rate.toFixed(3) : rate.toFixed(2);

  infoElem.firstElementChild.textContent = `1 ${selectList[0].value}`;
  infoElem.lastElementChild.textContent = `${
    rate < 0.1 ? rate.toFixed(6) : rate.toFixed(2)
  } ${selectList[1].value}`;
}
