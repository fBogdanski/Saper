import { BOUNDS } from "./constants.js";
import { gameOver, gameWin, isGameActive } from "./gameLogic.js";

let size = 10;
let bombs = [];
let remainingBombs = 0;
let remainingFlags = 0;

export function generateBoard(boardSize, bombAmount) {
  try {
    remainingBombs = bombAmount;
    remainingFlags = bombAmount;
    size = boardSize;
    bombs = generateMines(size, bombAmount);
    const board = document.getElementById("board");
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${size}, 32px)`;
    board.style.gridTemplateRows = `repeat(${size}, 32px)`;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        try {
          const cell = document.createElement("button");
          cell.className = "board-cell";
          cell.dataset.row = i;
          cell.dataset.col = j;
          cell.dataset.discovered = "false";
          cell.dataset.hasFlag = "false";
          cell.style.color = "transparent";

          if (bombs.some(([r, c]) => r === i && c === j)) {
            cell.dataset.hasMine = "true";
          } else {
            cell.dataset.hasMine = "false";
            const count = countAdjacentBombs(i, j);
            cell.dataset.adjacentMines = count;
            cell.textContent = count === 0 ? " " : count;
          }

          cell.addEventListener("mousedown", (e) => {
            if (!isGameActive()) return;
            try {
              if (e.button === 0) leftClick(cell);
              else if (e.button === 2) rightClick(cell);
            } catch (error) {
              console.error("Click error:", error);
            }
          });

          board.appendChild(cell);
        } catch (error) {
          console.error("Cell generation error:", error);
        }
      }
    }

    const boardCells = board.querySelectorAll(".board-cell");
    boardCells.forEach((cell) => {
      try {
        cell.style.aspectRatio = "1 / 1";
      } catch (error) {
        console.error("cell ratio error:", error);
      }
    });
  } catch (error) {
    console.error("Error generating board:", error);
  }
}

function generateMines(size, amount) {
  const mines = new Set();
  while (mines.size < amount) {
    const index = Math.floor(Math.random() * size * size);
    mines.add(index);
  }
  return [...mines].map((i) => [Math.floor(i / size), i % size]);
}

function countAdjacentBombs(i, j) {
  return BOUNDS.map(([di, dj]) => [i + di, j + dj])
    .filter(([ni, nj]) => ni >= 0 && nj >= 0 && ni < size && nj < size)
    .filter(([ni, nj]) => bombs.some(([bi, bj]) => bi === ni && bj === nj))
    .length;
}

function leftClick(cell) {
  try {
    if (cell.dataset.hasFlag === "true") return;
    if (cell.dataset.hasMine === "true") {
      cell.style.backgroundColor = "red";
      gameOver("bombExplosion");
    } else {
      revealCell(cell);
    }
  } catch (error) {
    console.error("Left click error:", error);
  }
}

function rightClick(cell) {
  try {
    if (cell.dataset.discovered === "true") return;

    if (cell.dataset.hasFlag === "false" && remainingFlags !== 0) {
      remainingFlags--;
      document.getElementById(
        "flag_counter"
      ).textContent = `Flags left: ${remainingFlags}`;
      cell.dataset.hasFlag = "true";
      cell.dataset.prevContent = cell.innerHTML;
      cell.innerHTML = "&#128681;";
      cell.style.color = "black";

      if (cell.dataset.hasMine === "true") {
        remainingBombs--;
        if (remainingBombs === 0) {
          gameWin();
        }
      }
    } else if (cell.dataset.hasFlag === "true") {
      remainingFlags++;
      document.getElementById(
        "flag_counter"
      ).textContent = `Flags left: ${remainingFlags}`;
      cell.dataset.hasFlag = "false";
      cell.style.color = "transparent";
      cell.textContent = cell.dataset.adjacentMines;
      if (cell.dataset.hasMine === "true") remainingBombs++;
    }
  } catch (error) {
    console.error("Right click error:", error);
  }
}

function revealCell(cell) {
  try {
    if (cell.dataset.discovered === "true") return;
    cell.dataset.discovered = "true";
    const nonBombFields = document.querySelectorAll(
      `button[data-has-mine="false"]`
    );
    const nonBombFieldsArray = Array.from(nonBombFields);
    const undiscovered = nonBombFieldsArray.filter(
      (element) => element.dataset.discovered === "false"
    );
    if (undiscovered.length === 0) {
      gameWin();
    }

    cell.style.color = "black";
    if (parseInt(cell.dataset.adjacentMines) === 0) {
      cell.style.backgroundColor = "lightGrey";
      const i = parseInt(cell.dataset.row);
      const j = parseInt(cell.dataset.col);
      BOUNDS.forEach(([di, dj]) => {
        const ni = i + di;
        const nj = j + dj;
        if (ni >= 0 && nj >= 0 && ni < size && nj < size) {
          try {
            const neighbor = document.querySelector(
              `button[data-row='${ni}'][data-col='${nj}']`
            );
            if (neighbor) revealCell(neighbor);
          } catch (error) {
            console.error("Recursion error:", error);
          }
        }
      });
    }
  } catch (error) {
    console.error("Reveal cell error:", error);
  }
}
