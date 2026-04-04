# Simple Calculator Web App

A lightweight, browser‑based calculator that performs basic arithmetic operations. The app is built with plain **HTML**, **CSS**, and **JavaScript**—no build tools, frameworks, or server side components are required.

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
  - [User Interface](#user-interface)
  - [Button Functions](#button-functions)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [Error Handling](#error-handling)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Tech Stack

The project uses only front‑end web technologies:

- **HTML** – `index.html` defines the calculator layout and accessibility attributes.
- **CSS** – `styles.css` provides styling, layout, and responsive design.
- **JavaScript** – `app.js` implements the calculator logic, button handling, and keyboard support.

---

## Features

- **Basic arithmetic** – addition, subtraction, multiplication, division.
- **Clear (C) and Backspace (←)** – reset the calculator or delete the last digit.
- **Keyboard support** – use number keys, `+ - * /`, `Enter`/`=` for equals, `Esc` for clear, and `Backspace`.
- **Error handling** – division by zero displays an `Error` message and disables further input until cleared.
- **Responsive UI** – works on desktop and mobile browsers.
- **Accessible markup** – ARIA live region for the display and appropriate `aria-label`s on buttons.

---

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your‑username/simple‑calculator.git
   cd simple‑calculator
   ```
2. **Open the app**
   - Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari, etc.). No build step, package manager, or server is required.

---

## Usage

### User Interface

The calculator consists of a display area and a keypad:

- **Display** – Shows the current input or result. Implemented as a `<div id="display">` with `aria-live="polite"` for screen‑reader updates.
- **Keypad** – Buttons for digits, operators, clear, backspace, decimal point, and equals.

### Button Functions

| Button | Action | Description |
|--------|--------|-------------|
| `0‑9` | **Digit** | Appends the digit to the current number.
| `.` | **Decimal point** | Adds a decimal point (only one per number).
| `+ - * /` | **Operator** | Stores the current number and selected operator for the next operand.
| `=` | **Equals** | Computes the result of the pending operation.
| `C` | **Clear** | Resets the calculator to its initial state.
| `←` | **Backspace** | Deletes the last character of the current input.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0‑9` | Append digit |
| `.` | Decimal point |
| `+ - * /` | Choose operator |
| `Enter` or `=` | Compute result |
| `Escape` | Clear |
| `Backspace` | Delete last character |

All keys are intercepted by the script to prevent default browser behavior (e.g., scrolling).

### Error Handling

- Attempting to divide by zero results in the display showing `Error`.
- While in the error state, further input is ignored until the user presses **Clear** (`C` or `Esc`).

---

## File Structure

```
/simple-calculator
│
├─ index.html      # Markup for the calculator UI
├─ styles.css      # Styling and layout rules
├─ app.js          # Calculator class and event handling logic
└─ README.md       # Project documentation (this file)
```

- **index.html** – Contains the calculator container, display element, and button grid. Each button uses `data-action` and `data-value` attributes that the JavaScript reads to trigger the appropriate behavior.
- **styles.css** – Defines the visual appearance, including grid layout, button sizing, colors, and responsive adjustments.
- **app.js** – Implements a `Calculator` class handling state (current input, previous value, selected operator, error flag) and provides methods for digit entry, operator selection, computation, clearing, and backspacing. It also wires up click events for the buttons and keyboard listeners for seamless interaction.

---

## Contributing

Contributions are welcome! If you would like to improve the calculator (e.g., add scientific functions, improve styling, or enhance accessibility), follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug‑fix.
3. Make your changes and ensure the app still works by opening `index.html`.
4. Submit a pull request with a clear description of what you changed.

Please adhere to the existing coding style and keep the project dependency‑free.

---

## License

[MIT License](LICENSE) – *(replace with actual license file when added)*
