const inputExpression = document.querySelector(".input-expression");
const resultDisplay = document.querySelector(".result");
const buttons = document.querySelectorAll("button");

let currentInput = "0";
let currentResult = "";
let shouldResetDisplay = false;
let lastResult = null;
let hasCalculated = false;

function updateDisplay() {
    inputExpression.textContent = currentInput;
    resultDisplay.textContent = currentResult;
}

function handleNumber(num) {
    if (currentInput === "0" || shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        currentInput += num;
    }
    currentResult = "";
    hasCalculated = false;
    updateDisplay();
}

function handleOperator(op) {
    const lastChar = currentInput.slice(-1);
    const operators = ["+", "-", "×", "÷"];

    // Allow starting with a negative number
    if (currentInput === "0" && op === "-") {
        currentInput = "-";
        updateDisplay();
        return;
    }

    // Auto-insert multiplication before (
    if (op === "(" && /[0-9)]$/.test(lastChar)) {
        currentInput += "×(";
    }
    // Prevent invalid ')'
    else if (op === ")" && !/[0-9)]$/.test(lastChar)) {
        return;
    }
    // If result already shown and user continues
    else if (hasCalculated && lastResult !== null) {
        currentInput = lastResult + op;
        hasCalculated = false;
    }
    // Replace operator if one already at the end
    else if (operators.includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + op;
    }
    else {
        currentInput += op;
    }

    shouldResetDisplay = false;
    currentResult = "";
    updateDisplay();
}

function calculate() {
    try {
        const expression = currentInput.replace(/×/g, "*").replace(/÷/g, "/");
        // Use safer Function constructor
        const result = new Function("return " + expression)();
        lastResult = result.toString();
        currentResult = lastResult;
        hasCalculated = true;
    } catch (error) {
        currentResult = "Error";
    }
    shouldResetDisplay = true;
    updateDisplay();
}

function clear() {
    currentInput = "0";
    currentResult = "";
    lastResult = null;
    hasCalculated = false;
    shouldResetDisplay = false;
    updateDisplay();
}

function handleBackspace() {
    // If user just got a result, clear instead of deleting
    if (hasCalculated) {
        clear();
        return;
    }

    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = "0";
    }

    currentResult = "";
    hasCalculated = false;
    updateDisplay();
}
    // =============BUTTON INSIDE WEB=========
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.textContent;

        if ((value >= "0" && value <= "9") || value === ".") {
            handleNumber(value);
        } else if (
            value === "+" ||
            value === "-" ||
            value === "×" ||
            value === "÷" ||
            value === "(" ||
            value === ")"
        ) {
            handleOperator(value);
        } else if (value === "=") {
            calculate();
        } else if (value === "C") {
            clear();
        }
    });
});

// =================== KEYBOARD KEYS============ 

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if ((key >= "0" && key <= "9") || key === ".") {
        handleNumber(key);
    } else if (key === "+" || key === "-" || key === "*" || key === "/") {
        handleOperator(key === "*" ? "×" : key === "/" ? "÷" : key);
    } else if (key === "Enter" || key === "=") {
        calculate();
    } else if (key === "Escape" || key === "Delete") {
        clear();
    } else if (key === "(" || key === ")") {
        handleOperator(key);
    } else if (key === "Backspace") {
        handleBackspace();
    }
});
