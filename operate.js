const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function populateBaseSelect() {
  const baseSelect = document.getElementById("operationBase");
  for (let i = 2; i <= 36; i++) {
    baseSelect.innerHTML += `<option value="${i}">${i}진수</option>`;
  }
  baseSelect.value = 10;
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

function handleOperate() {
  const A = document.getElementById("numA").value.trim();
  const B = document.getElementById("numB").value.trim();
  const op = document.getElementById("op").value;
  const base = parseInt(document.getElementById("operationBase").value);
  const resultField = document.getElementById("operationResult");

  try {
    if (!A || !B) throw new Error("두 숫자를 모두 입력해주세요.");
    const decA = baseNtoDecimal(A, base);
    const decB = baseNtoDecimal(B, base);

    let result;
    if (op === "add") result = decA + decB;
    else if (op === "sub") result = decA - decB;
    else if (op === "mul") result = decA * decB;

    const final = decimalToBaseN(result, base);
    const expr = `${A} ${opSymbol(op)} ${B} (in ${base}진법)`;
    resultField.textContent = `${expr} = ${final}`;
    resultField.style.color = "black";

    saveToHistory(expr, final); // 기록 저장
  } catch (e) {
    resultField.textContent = "오류: " + e.message;
    resultField.style.color = "red";
  }
}

function opSymbol(op) {
  return { add: "+", sub: "−", mul: "×" }[op];
}

// 공통 기록 관리
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
