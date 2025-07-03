"use strict";
export const DIFFICULTY_SETTINGS = {
  easy: {
    size: 10,
    time: 600,
  },
  medium: {
    size: 16,
    time: 2400,
  },
  hard: {
    size: 30,
    time: 5400,
  },
};

export const BOUNDS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [1, -1],
  [1, 0],
  [0, 1],
  [1, 1],
];
