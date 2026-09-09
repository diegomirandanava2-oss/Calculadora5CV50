let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

const currentDisplay = document.getElementById('current-operand');
const previousDisplay = document.getElementById('previous-operand');

function updateDisplay() {
  currentDisplay.innerText = currentOperand;
  if (operation != null) {
    previousDisplay.innerText = `${previousOperand} ${operation}`;
  } else {
    previousDisplay.innerText = '';
  }
}

function appendNumber(number) {
  if (currentOperand === 'Error') clearAll();

  if (shouldResetScreen) {
    currentOperand = '';
    shouldResetScreen = false;
  }

  // Evita poner dos puntos en el mismo número
  if (number === '.' && currentOperand.includes('.')) return;

  if (currentOperand === '0' && number !== '.') {
    currentOperand = number;
  } else {
    currentOperand += number;
  }
  updateDisplay();
}

function chooseOperation(op) {
  if (currentOperand === 'Error') return;

  // Permite continuar la operación usando el resultado anterior
  if (previousOperand !== '') {
    compute();
  }

  operation = op;
  previousOperand = currentOperand;
  shouldResetScreen = true;
  updateDisplay();
}

function compute() {
  let computation;
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return;

  switch (operation) {
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
      // Control de división entre cero
      if (current === 0) {
        currentOperand = 'Error';
        previousOperand = '';
        operation = undefined;
        updateDisplay();
        shouldResetScreen = true;
        return;
      }
      computation = prev / current;
      break;
    default:
      return;
  }

  // Redondear a máximo 2 decimales si los tiene
  currentOperand = Math.round((computation + Number.EPSILON) * 100) / 100;
  currentOperand = currentOperand.toString();

  operation = undefined;
  previousOperand = '';
  shouldResetScreen = true;
  updateDisplay();
}

function clearAll() {
  currentOperand = '0';
  previousOperand = '';
  operation = undefined;
  shouldResetScreen = false;
  updateDisplay();
}

function deleteDigit() {
  if (currentOperand === 'Error') {
    clearAll();
    return;
  }
  if (shouldResetScreen) return;

  currentOperand = currentOperand.toString().slice(0, -1);
  if (currentOperand === '') {
    currentOperand = '0';
  }
  updateDisplay();
}