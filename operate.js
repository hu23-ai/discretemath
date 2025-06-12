const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function populateBaseSelect() {
  const baseSelect = document.getElementById("operationBase");
  for (let i = 2; i <= 36; i++) {
    baseSelect.innerHTML += `<option value="${i}">Base ${i}</option>`;
  }
  baseSelect.value = 10;
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

function handleOperate() {
  const A = document.getElementById("numA").value.trim();
  const B = document.getElementById("numB").value.trim();
  const op = document.getElementById("op").value;
  const base = parseInt(document.getElementById("operationBase").value);
  const resultField = document.getElementById("operationResult");

  try {
    if (!A || !B) throw new Error("Please enter both numbers.");
    const decA = baseNtoDecimal(A, base);
    const decB = baseNtoDecimal(B, base);

    let result;
    if (op === "add") result = decA + decB;
    else if (op === "sub") result = decA - decB;
    else if (op === "mul") result = decA * decB;

    const final = decimalToBaseN(result, base);
    const expr = `${A} ${opSymbol(op)} ${B} (in base ${base})`;
    resultField.textContent = `${expr} = ${final}`;
    resultField.style.color = "black";

    saveToHistory(expr, final); 
  } catch (e) {
    resultField.textContent = "Error: " + e.message;
    resultField.style.color = "red";
  }
}

function opSymbol(op) {
  return { add: "+", sub: "−", mul: "×" }[op];
}


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
  populateBaseSelect();
  renderHistory();
};
