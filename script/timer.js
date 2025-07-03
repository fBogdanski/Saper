"use strict";
import { gameOver } from "./gameLogic.js";

let timerInterval;
let currentTime = 0;
let totalTime = 0;
let timeCallback = null;

export function setTimeCallback(callback) {
  try {
    timeCallback = callback;
  } catch (error) {
    console.error("Error setting time callback:", error);
  }
}

export function startTimer(duration) {
  try {
    clearInterval(timerInterval);
    currentTime = duration;
    totalTime = duration;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      try {
        currentTime--;
        updateTimerDisplay();

        if (timeCallback) {
          timeCallback(currentTime);
        }

        if (currentTime <= 0) {
          clearInterval(timerInterval);
          gameOver("timeout");
        }
      } catch (intervalError) {
        console.error("Error inside timer interval:", intervalError);
        clearInterval(timerInterval);
      }
    }, 1000);
  } catch (error) {
    console.error("Error starting timer:", error);
  }
}

export function stopTimer() {
  try {
    clearInterval(timerInterval);
  } catch (error) {
    console.error("Error stopping timer:", error);
  }
}

function updateTimerDisplay() {
  try {
    const timerText = document.getElementById("timer_text");
    const timerBar = document.getElementById("timer_bar");
    if (!timerText || !timerBar) return;
    const minutes = Math.floor(currentTime / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (currentTime % 60).toString().padStart(2, "0");
    timerText.textContent = `${minutes}:${seconds}`;
    const percent = (currentTime / totalTime) * 100;
    timerBar.style.width = `${percent}%`;
  } catch (error) {
    console.error("Error updating timer display:", error);
  }
}
