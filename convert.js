const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function populateBaseOptions() {
  const fromBase = document.getElementById("fromBase");
  const toBase = document.getElementById("toBase");
  for (let i = 2; i <= 36; i++) {
    const option = `<option value="${i}">Base ${i}</option>`;
    fromBase.innerHTML += option;
    toBase.innerHTML += option;
  }
  fromBase.value = "10";
  toBase.value = "2";
}

function baseNtoDecimal(str, base) {
  str = str.toUpperCase();
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    const val = digits.indexOf(str[i]);
    if (val === -1 || val >= base) {
      throw new Error(`'${str[i]}' is not valid in base ${base}.`);
    }
    result = result * base + val;
  }
  return result;
}

function decimalToBaseN(num, base) {
  if (num === 0) return "0";
  let result = "";
  const isNegative = num < 0;
  num = Math.abs(num);
  while (num > 0) {
    const remainder = num % base;
    result = digits[remainder] + result;
    num = Math.floor(num / base);
  }
  return isNegative ? "-" + result : result;
}

function handleConvert() {
  const input = document.getElementById("inputNumber").value.trim();
  const fromBase = parseInt(document.getElementById("fromBase").value);
  const toBase = parseInt(document.getElementById("toBase").value);
  const resultElement = document.getElementById("result");

  try {
    if (input === "") throw new Error("No input value.");
    const decimal = baseNtoDecimal(input, fromBase);
    const converted = decimalToBaseN(decimal, toBase);
    const expression = `${input} (Base ${fromBase}) → (Base ${toBase})`;
    const result = converted;

    resultElement.textContent = `${expression} = ${result}`;
    resultElement.style.color = "black";

    saveToHistory(expression, result);
  } catch (e) {
    resultElement.textContent = `Error: ${e.message}`;
    resultElement.style.color = "red";
  }
}

// Preset buttons for common base conversions
function setPreset(from, to) {
  document.getElementById("fromBase").value = from;
  document.getElementById("toBase").value = to;
}

// History functions
function saveToHistory(expression, result) {
  const record = `${expression} = ${result}`;
  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.push(record);
  localStorage.setItem("calcHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("historyList");
  if (!list) return;
  list.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.slice().reverse().forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("calcHistory");
  renderHistory();
}

function toggleHistory() {
  document.getElementById("historyPanel").classList.toggle("open");
}

window.onload = () => {
  populateBaseOptions();
  renderHistory();
};
