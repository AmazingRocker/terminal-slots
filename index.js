const prompt = require("prompt-sync")();

const ROWS = 3;
const COLUMNS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount, Try again...");
    } else {
      return numberDepositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const depositAmount = prompt("Enter the number of lines to bet on (1-3): ");
    const numberOfLinesAmount = parseFloat(depositAmount);

    if (
      isNaN(numberOfLinesAmount) ||
      numberOfLinesAmount <= 0 ||
      numberOfLinesAmount > 3
    ) {
      console.log("Invalid number of lines, Try again...");
    } else {
      return numberOfLinesAmount;
    }
  }
};

const getBet = (balance, amountOfLines) => {
  while (true) {
    const bet = prompt("Enter the bet per line: ");
    const betAmount = parseFloat(bet);

    if (
      isNaN(betAmount) ||
      betAmount <= 0 ||
      betAmount > balance / amountOfLines
    ) {
      console.log("Invalid bet, try again");
    } else {
      return betAmount;
    }
  }
};

const spin = () => {
  const symbols = [];

  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];

  for (let i = 0; i < COLUMNS; i++) {
    reels.push([]);

    const reelsSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelsSymbols.length);
      const selectedSymbol = reelsSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelsSymbols.slice(randomIndex, 1);
    }
  }

  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLUMNS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

const display = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }

    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const [symbol] of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log("Your balance is $" + balance);

    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;

    const reels = spin();
    const rows = transpose(reels);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;

    display(rows);
    console.log("You won, $" + winnings);

    if (balance <= 0) {
      console.log("You ran out of money!");
      break;
    }

    const playAgain = prompt("Do you want to play again (y/n)?");

    if (playAgain != "y") {
      break;
    }
  }
};

game();
