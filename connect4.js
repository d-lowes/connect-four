"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

// TODO: use Array.from() method

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    let columns = [];

    for (let x = 0; x < WIDTH; x++) {
      columns.push(null);
    }

    board.push(columns);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");

  //adds "drop zone" part where players click to add their piece
  const topRow = document.createElement("tr");
  topRow.setAttribute("id", "column-top");
  topRow.addEventListener("click", handleClick);

  // adds the individual cells to the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", `top-${x}`);
    topRow.append(headCell);
  }

  htmlBoard.append(topRow);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    const gameBoardRow = document.createElement("tr");

    for (let x = 0; x < WIDTH; x++) {
      const tableCell = document.createElement("td"); //table cell

      // you'll use this later, so make sure you use c-y-x
      tableCell.setAttribute("id", `c-${y}-${x}`);

      gameBoardRow.append(tableCell);
    }

    htmlBoard.append(gameBoardRow);
  }
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */

//x is not descriptive
function findSpotForCol(x) {
  for (let y = HEIGHT-1; y >= 0; y--) {

    if (board[y][x] === null) {

      return y;
    }
  }

  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const gamePiece = document.createElement("div");
  const tableCell = document.getElementById(`c-${y}-${x}`);

  gamePiece.classList.add("piece");
  gamePiece.classList.add(`p${currPlayer}`);
  tableCell.append(gamePiece);
}

/** endGame: announce game end */

function endGame(msg) {
  setTimeout(() => {
    alert(`GAME OVER! PLAYER ${currPlayer} WINS!`);
  }, 100);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = Number(evt.target.id.slice("top-".length));

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);

  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;

  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }


  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board[0].every((cell) => cell !== null)) {
    endGame("Game over!");
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {

    for (let i = 0; i < cells.length; i++) {
      let y = cells[i][0];
      let x = cells[i][1];

      if (y < 0 || y >= HEIGHT || x < 0 || x >= WIDTH) {
        return false;
      }

      if (board[y][x] !== currPlayer) {
        return false;
      }
    }

    return true;

  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // TODO: assign values to the below variables for each of the ways to win
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3]
      ];

      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x]
      ];

      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3]
      ];

      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3]
      ];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();