"use strict";
import { generateBoard } from "./board.js";
import { startTimer, setTimeCallback } from "./timer.js";
import { DIFFICULTY_SETTINGS } from "./constants.js";
import {
  displayBestTimes,
  setCurrentTime,
  setGameActive,
} from "./gameLogic.js";

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
const form = document.getElementById("gameForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      startGame();
    } catch (error) {
      console.error("StartGame error:", error);
    }
  });
} else {
  console.error("Game form not found error:");
}

function startGame() {
  try {
    const difficultySelect = document.getElementById("difficulty");
    const bombAmountInput = document.getElementById("bomb_amount");
    const gamestateField = document.getElementById("gamestate");
    const flagCounter = document.getElementById("flag_counter");

    if (
      !difficultySelect ||
      !bombAmountInput ||
      !gamestateField ||
      !flagCounter
    ) {
      throw new Error("Missing Elements");
    }

    const difficulty = difficultySelect.value;
    const bombAmount = parseInt(bombAmountInput.value);
    const { size, time } = DIFFICULTY_SETTINGS[difficulty];

    gamestateField.style.display = "none";

    setGameActive(true, difficulty);
    generateBoard(size, bombAmount);

    setTimeCallback((remaining) => {
      setCurrentTime(time - remaining);
    });

    flagCounter.textContent = `Flags left: ${bombAmount}`;
    startTimer(time);
  } catch (error) {
    console.error("StartGame error:", error);
  }

  try {
    displayBestTimes();
  } catch (error) {
    console.error("DisplayBestTimes error:", error);
  }
}
