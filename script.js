let currentInput = '0';
let previousInput = '';
let operator = null;
let resetScreen = false;
let isPercentOperation = false; // Registra si la entrada actual es un porcentaje

const resultDisplay = document.getElementById('result');
const operationDisplay = document.getElementById('operation');

function updateDisplay() {
  resultDisplay.innerText = currentInput;
  if (operator !== null) {
    if (isPercentOperation) {
      operationDisplay.innerText = `${previousInput} ${operator} ${currentInput}%`;
    } else {
      operationDisplay.innerText = `${previousInput} ${operator}`;
    }
  } else {
    operationDisplay.innerText = '';
  }
}

function appendNumber(number) {
  if (currentInput === '0' || resetScreen) {
    currentInput = number;
    resetScreen = false;
  } else {
    currentInput += number;
  }
  isPercentOperation = false;
  updateDisplay();
}

function appendDecimal(dot) {
  if (resetScreen) {
    currentInput = '0.';
    resetScreen = false;
  } else if (!currentInput.includes('.')) {
    currentInput += dot;
  }
  isPercentOperation = false;
  updateDisplay();
}

function appendOperator(op) {
  if (operator !== null && !resetScreen) calculate();
  previousInput = currentInput;
  operator = op;
  resetScreen = true;
  isPercentOperation = false;
  updateDisplay();
}

function toggleSign() {
  if (currentInput !== '0') {
    if (currentInput.startsWith('-')) {
      currentInput = currentInput.slice(1);
    } else {
      currentInput = '-' + currentInput;
    }
    updateDisplay();
  }
}

function appendPercentage() {
  // Si no hay operador previo (ej. solo pones 100 y presionas %)
  if (operator === null) {
    let value = parseFloat(currentInput);
    if (!isNaN(value)) {
      currentInput = formatResult(value / 100);
      updateDisplay();
    }
    return;
  }

  // Si hay un operador (ej. 100 + 10 y luego presionas %)
  isPercentOperation = true;
  updateDisplay();
}

function calculate() {
  if (operator === null || resetScreen) return;

  let prev = parseFloat(previousInput);
  let current = parseFloat(currentInput);
  let computation = 0;

  if (isNaN(prev) || isNaN(current)) return;

  // Si el usuario presionó el botón %, se calcula la porción equivalente
  if (isPercentOperation) {
    if (operator === '+' || operator === '-') {
      // Calcula el porcentaje sobre el valor base (ej. el 10% de 100 = 10)
      current = (prev * current) / 100;
    } else if (operator === '×' || operator === '÷') {
      current = current / 100;
    }
  }

  switch (operator) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '×':
      computation = prev * current;
      break;
    case '÷':
      if (current === 0) {
        alert("Error: No se puede dividir entre cero");
        clearAll();
        return;
      }
      computation = prev / current;
      break;
    default:
      return;
  }

  if (isPercentOperation) {
    operationDisplay.innerText = `${previousInput} ${operator} ${currentInput}% =`;
  } else {
    operationDisplay.innerText = `${previousInput} ${operator} ${currentInput} =`;
  }

  currentInput = formatResult(computation);
  operator = null;
  resetScreen = true;
  isPercentOperation = false;
  resultDisplay.innerText = currentInput;
}

function formatResult(num) {
  return (Math.round(num * 100) / 100).toString();
}

function clearAll() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  resetScreen = false;
  isPercentOperation = false;
  updateDisplay();
}

function deleteLast() {
  if (resetScreen) return;
  if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  isPercentOperation = false;
  updateDisplay();
}