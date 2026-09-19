let currentInput = '0';
let operationString = '';
let memoryValue = 0;
let newNumber = true;

const resultDisplay = document.getElementById('result');
const operationDisplay = document.getElementById('operation');

function updateDisplay() {
    if (resultDisplay) resultDisplay.innerText = currentInput;
    if (operationDisplay) operationDisplay.innerText = operationString;
}

// === NÚMEROS Y DECIMALES ===
function appendNumber(num) {
    if (currentInput === '0' || currentInput === 'Error' || newNumber) {
        currentInput = num;
        newNumber = false;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function appendDecimal(dot) {
    if (newNumber) {
        currentInput = '0.';
        newNumber = false;
    } else if (!currentInput.includes('.')) {
        currentInput += dot;
    }
    updateDisplay();
}

// === OPERADORES MATEMÁTICOS ===
function appendOperator(op) {
    if (operationString === '' || newNumber) {
        operationString = currentInput + ' ' + op + ' ';
    } else {
        // Permite encadenar operaciones antes de presionar "="
        calculateInternal();
        operationString = currentInput + ' ' + op + ' ';
    }
    currentInput = '0';
    newNumber = true;
    updateDisplay();
}

function calculateInternal() {
    if (operationString === '') return;
    let expression = operationString + currentInput;
    expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
    
    try {
        let result = eval(expression);
        if (!isFinite(result)) {
            currentInput = 'Error';
        } else {
            currentInput = Number(result.toFixed(2)).toString(); // Máximo 2 decimales
        }
    } catch (e) {
        currentInput = 'Error';
    }
}

function calculate() {
    calculateInternal();
    operationString = ''; 
    newNumber = true;
    updateDisplay();
}

// === FUNCIONES DE HERRAMIENTAS (C, Borrar, Signo, Porcentaje) ===
function clearAll() {
    currentInput = '0';
    operationString = '';
    newNumber = true;
    updateDisplay();
}

function deleteLast() {
    if (newNumber) return; // Evita borrar el resultado de una operación terminada
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '-' || currentInput === '') currentInput = '0';
    } else {
        currentInput = '0';
        newNumber = true;
    }
    updateDisplay();
}

function toggleSign() {
    if (currentInput !== '0' && currentInput !== 'Error') {
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.substring(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
    }
}

function appendPercentage() {
    let val = parseFloat(currentInput);
    if (isNaN(val)) return;

    if (operationString !== '') {
        // Porcentaje relativo (Ej: 200 + 10%)
        let prevVal = parseFloat(operationString);
        if (!isNaN(prevVal)) {
            currentInput = (prevVal * (val / 100)).toString();
        }
    } else {
        // Porcentaje directo (Ej: 50% = 0.5)
        currentInput = (val / 100).toString();
    }
    updateDisplay();
}

// === FUNCIONES DE MEMORIA (M+, M-, MR, MC) ===
function handleMC() {
    memoryValue = 0;
}

function handleMR() {
    currentInput = memoryValue.toString();
    newNumber = true;
    updateDisplay();
}

function handleMPlus() {
    let val = parseFloat(currentInput);
    if (!isNaN(val)) {
        memoryValue += val;
    }
    newNumber = true; // Reinicia el input para el siguiente número
}

function handleMMinus() {
    let val = parseFloat(currentInput);
    if (!isNaN(val)) {
        memoryValue -= val;
    }
    newNumber = true;
}