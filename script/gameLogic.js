"use strict";
import { stopTimer } from "./timer.js";

let gameActive = true;
let currentDifficulty = null;
let currentTimeTaken = 0;

export function isGameActive() {
  return gameActive;
}

export function setGameActive(state, difficulty = null) {
  try {
    gameActive = state;
    if (difficulty) currentDifficulty = difficulty;
  } catch (error) {
    console.error("SetGameActive error:", error);
  }
}

export function setCurrentTime(time) {
  try {
    currentTimeTaken = time;
  } catch (error) {
    console.error("SetCurrentTime error:", error);
  }
}

function getStorageKey() {
  return `bestTime_${currentDifficulty}`;
}

function formatTime(seconds) {
  try {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  } catch (error) {
    console.error("FormatTime error:", error);
    return "--:--";
  }
}

function saveBestTime() {
  try {
    if (!currentDifficulty) return;
    const key = getStorageKey();
    const best = localStorage.getItem(key);
    if (!best || currentTimeTaken < parseInt(best)) {
      localStorage.setItem(key, currentTimeTaken.toString());
    }
  } catch (error) {
    console.error("BestTimeSaver error:", error);
  }
}

export function displayBestTimes() {
  try {
    const tableBody = document.getElementById("records_body");
    if (!tableBody) return;
    ["easy", "medium", "hard"].forEach((level) => {
      try {
        const best = localStorage.getItem(`bestTime_${level}`);
        const row = document.getElementById(`record_${level}`);
        if (row) {
          const timeCell = row.querySelector(".best-time");
          if (timeCell) {
            timeCell.textContent = best ? formatTime(parseInt(best)) : "-";
          }
        }
      } catch (innerError) {
        console.error(`Error updating record row for ${level}:`, innerError);
      }
    });
  } catch (error) {
    console.error("BestTimesDisplay error:", error);
  }
}

export function gameWin() {
  try {
    const gameStateField = document.getElementById("gamestate");
    if (gameStateField) {
      gameStateField.innerHTML = "You Win!";
      gameStateField.style.display = "block";
      gameStateField.style.color = "#4db251";
    }
    stopTimer();
    saveBestTime();
    displayBestTimes();
    gameActive = false;
  } catch (error) {
    console.error("GameWin error:", error);
  }
}

export function gameOver(reason) {
  try {
    const gameStateField = document.getElementById("gamestate");
    if (gameStateField) {
      gameStateField.style.color = "red";
      gameStateField.innerHTML =
        reason === "timeout" ? "Timeout!" : "Game Over!";
      gameStateField.style.display = "block";
    }
    stopTimer();
    gameActive = false;
  } catch (error) {
    console.error("GameOver error:", error);
  }
}
