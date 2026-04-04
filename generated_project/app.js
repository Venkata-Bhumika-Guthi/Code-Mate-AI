// app.js - Simple Calculator implementation
// This script defines a Calculator class that handles the logic and UI interaction
// for the calculator defined in index.html. It supports click and keyboard input.

class Calculator {
  /**
   * @param {HTMLElement} displayElement - The element where the calculator displays its output.
   */
  constructor(displayElement) {
    this.displayElement = displayElement;
    this.currentInput = "0"; // start with 0 displayed
    this.previousValue = null; // first operand
    this.operator = null; // '+', '-', '*', '/'
    this.error = false; // flag for error state (e.g., division by zero)
    this.updateDisplay();
  }

  /** Append a digit or decimal point to the current input. */
  appendDigit(digit) {
    if (this.error) return; // ignore input while in error state
    // Prevent multiple decimal points
    if (digit === "." && this.currentInput.includes(".")) return;

    // If the current input is just "0" (and not a decimal), replace it unless the digit is a decimal point
    if (this.currentInput === "0" && digit !== ".") {
      this.currentInput = digit;
    } else {
      this.currentInput += digit;
    }
    this.updateDisplay();
  }

  /** Choose an operator (+, -, *, /). Stores the current number as previousValue. */
  chooseOperator(op) {
    if (this.error) return;
    // If there is a pending operation, compute it first (chain calculations)
    if (this.operator && this.previousValue !== null && this.currentInput !== "") {
      this.compute();
    }
    // Store the current input as the first operand
    const value = parseFloat(this.currentInput);
    if (!isNaN(value)) {
      this.previousValue = value;
    }
    this.operator = op;
    this.currentInput = "0"; // reset for next number entry
    this.updateDisplay();
  }

  /** Perform the calculation based on the stored operator and operands. */
  compute() {
    if (this.error) return;
    if (this.operator === null || this.previousValue === null) return; // nothing to compute
    const secondOperand = parseFloat(this.currentInput);
    if (isNaN(secondOperand)) return;
    let result;
    switch (this.operator) {
      case "+":
        result = this.previousValue + secondOperand;
        break;
      case "-":
        result = this.previousValue - secondOperand;
        break;
      case "*":
        result = this.previousValue * secondOperand;
        break;
      case "/":
        if (secondOperand === 0) {
          this.currentInput = "Error";
          this.error = true;
          this.updateDisplay();
          return;
        }
        result = this.previousValue / secondOperand;
        break;
      default:
        return;
    }
    // Trim unnecessary decimal zeros (e.g., 5.0 -> 5)
    this.currentInput = Number.isFinite(result) ? String(result) : "Error";
    if (this.currentInput === "Error") this.error = true;
    // Reset for next operation
    this.previousValue = null;
    this.operator = null;
    this.updateDisplay();
  }

  /** Clear all state and reset the display. */
  clear() {
    this.currentInput = "0";
    this.previousValue = null;
    this.operator = null;
    this.error = false;
    this.updateDisplay();
  }

  /** Remove the last character from the current input. */
  backspace() {
    if (this.error) return;
    if (this.currentInput.length <= 1) {
      this.currentInput = "0";
    } else {
      this.currentInput = this.currentInput.slice(0, -1);
    }
    this.updateDisplay();
  }

  /** Update the calculator's display element with the current input. */
  updateDisplay() {
    this.displayElement.textContent = this.currentInput;
  }
}

// ---------------------------------------------------------------------------
// Initialization and event handling
// ---------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const displayEl = document.getElementById("display");
  if (!displayEl) {
    console.error("Display element not found");
    return;
  }
  const calc = new Calculator(displayEl);

  // Expose for debugging (optional)
  window.Calculator = Calculator;
  window.calc = calc;

  // Click handling for all buttons with class .btn
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const value = button.dataset.value; // may be undefined for some actions
      switch (action) {
        case "digit":
          calc.appendDigit(value);
          break;
        case "operator":
          calc.chooseOperator(value);
          break;
        case "equals":
          calc.compute();
          break;
        case "clear":
          calc.clear();
          break;
        case "backspace":
          calc.backspace();
          break;
        default:
          // No-op for unknown actions
          break;
      }
    });
  });

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    const key = e.key;
    // Map keys to actions
    if (/[0-9]/.test(key)) {
      e.preventDefault();
      calc.appendDigit(key);
    } else if (key === ".") {
      e.preventDefault();
      calc.appendDigit(key);
    } else if (key === "+" || key === "-" || key === "*" || key === "/") {
      e.preventDefault();
      calc.chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
      e.preventDefault();
      calc.compute();
    } else if (key === "Escape") {
      e.preventDefault();
      calc.clear();
    } else if (key === "Backspace") {
      e.preventDefault();
      calc.backspace();
    }
  });
});
