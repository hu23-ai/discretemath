const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function populateBaseOptions() {
  const fromBase = document.getElementById("fromBase");
  const toBase = document.getElementById("toBase");
  for (let i = 2; i <= 36; i++) {
    const option = `<option value="${i}">${i}진수</option>`;
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
      throw new Error(`'${str[i]}'는 ${base}진법에 유효하지 않습니다.`);
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
    if (input === "") throw new Error("입력값이 없습니다.");
    const decimal = baseNtoDecimal(input, fromBase);
    const converted = decimalToBaseN(decimal, toBase);
    const expression = `${input} (${fromBase}진수) → (${toBase}진수)`;
    const result = converted;

    resultElement.textContent = `${expression} = ${result}`;
    resultElement.style.color = "black";

    saveToHistory(expression, result);
  } catch (e) {
    resultElement.textContent = `오류: ${e.message}`;
    resultElement.style.color = "red";
  }
}

// 자주 쓰는 진법 변환 preset 버튼
function setPreset(from, to) {
  document.getElementById("fromBase").value = from;
  document.getElementById("toBase").value = to;
}

// 기록 관련 함수들
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
