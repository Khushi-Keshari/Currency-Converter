const API_KEY = "a089a8cd-f05b4e53-ff77d1d1-66aad8d3"; // Replace with your actual API key
const BASE_URL = `https://api.exconvert.com/convert`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector("#from-currency");
const toCurr = document.querySelector("#to-currency");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = parseFloat(amount.value);
  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}?access_key=${API_KEY}&from=${fromCurr.value}&to=${toCurr.value}&amount=${amtVal}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
   
    
    console.log("API response:", data);

    
    if (data.error) {
      throw new Error(data.error.info || "API error");
    }

    
    if (data.result && typeof data.result.rate === "number") {
      const finalAmount = (amtVal * data.result.rate);
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } else if (data.conversion_rates && data.conversion_rates[toCurr.value.toUpperCase()]) {
     
      let rate = data.conversion_rates[toCurr.value.toUpperCase()];
      const finalAmount = (amtVal * rate).toFixed(2);
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } else {
      throw new Error("Invalid response format: 'result' or 'conversion_rates' missing.");
    }
  } catch (err) {
    console.error("Error:", err.message);
    msg.innerText = "Failed to fetch exchange rate. Check your API key or try later.";
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});

