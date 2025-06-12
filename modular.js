function mod(n, m) {
  return ((n % m) + m) % m;
}

function updateInputVisibility() {
  const op = document.getElementById("modOp").value;
  const bContainer = document.getElementById("bContainer");
  const preview = document.getElementById("preview");

  if (op === "inv") {
    bContainer.style.display = "none";
  } else {
    bContainer.style.display = "inline-block";
  }

  const aVal = document.getElementById("a").value || "A";
  const bVal = document.getElementById("b").value || "B";
  const mVal = document.getElementById("m").value || "M";

  if (op === "add") preview.textContent = `Expression: (${aVal} + ${bVal}) mod ${mVal}`;
  else if (op === "mul") preview.textContent = `Expression: (${aVal} × ${bVal}) mod ${mVal}`;
  else if (op === "inv") preview.textContent = `Expression: ${aVal}⁻¹ mod ${mVal}`;
}

function handleModular() {
  const a = parseInt(document.getElementById("a").value);
  const b = parseInt(document.getElementById("b").value);
  const m = parseInt(document.getElementById("m").value);
  const op = document.getElementById("modOp").value;
  const resultField = document.getElementById("modResult");
  const processField = document.getElementById("modProcess");

  try {
    if (isNaN(a) || isNaN(m) || (op !== "inv" && isNaN(b))) {
      throw new Error("Input is missing or invalid.");
    }
    if (m <= 0) throw new Error("mod M must be a positive integer.");

    let result;
    let expression;
    let process = "";

    if (op === "add") {
      result = mod(a + b, m);
      expression = `(${a} + ${b}) mod ${m}`;
    } else if (op === "mul") {
      result = mod(a * b, m);
      expression = `(${a} × ${b}) mod ${m}`;
    } else if (op === "inv") {
      const { inverse, steps } = modInverseWithSteps(mod(a, m), m);
      if (inverse === null) throw new Error("No modular inverse exists.");
      result = inverse;
      expression = `${a}⁻¹ mod ${m}`;
      process = steps.join("\n") + `\n⇒ Result: ${a}⁻¹ mod ${m} = ${inverse}`;
    }

    resultField.textContent = `Result: ${result}`;
    resultField.style.color = "black";
    processField.textContent = op === "inv" ? process : "";

    saveToHistory(expression, result);
  } catch (e) {
    resultField.textContent = "Error: " + e.message;
    resultField.style.color = "red";
    document.getElementById("modProcess").textContent = "";
  }

  updateInputVisibility();
}

function modInverseWithSteps(a, m) {
  let m0 = m, x0 = 0, x1 = 1;
  let steps = [];
  let origA = a, origM = m;

  if (m === 1) return { inverse: 0, steps: ["No modular inverse when M = 1."] };

  while (a > 1) {
    const q = Math.floor(a / m);
    steps.push(`${a} = ${q}×${m} + ${a % m}`);
    [a, m] = [m, a % m];
    [x0, x1] = [x1 - q * x0, x0];
  }

  if (a !== 1) return { inverse: null, steps: ["gcd ≠ 1 → No modular inverse"] };
  if (x1 < 0) x1 += m0;

  return { inverse: x1, steps };
}

// History functions
function toggleHistory() {
  document.getElementById("historyPanel").classList.toggle("open");
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

window.onload = () => {
  updateInputVisibility();
  renderHistory();
};
