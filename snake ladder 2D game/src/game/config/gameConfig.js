/**
 * Game Configuration
 * Contains all constant values for the game
 */

export const gameConfig = {
  // Dice face images
  diceImages: {
    1: "./images/dais1.png",
    2: "./images/dais2.png",
    3: "./images/dais3.png",
    4: "./images/dais4.png",
    5: "./images/dais5.png",
    6: "./images/dais6.png",
  },

  // Player images
  playerImages: [
    "./images/player 1.png",
    "./images/player 2.png",
    "./images/player 3.png",
    "./images/player 4.png",
  ],

  // Player colors
  playerColors: ["red", "green", "yellow", "purple"],

  // Snakes positions [start, end]
  snakes: [
    [20, 6],
    [39, 3],
    [77, 37],
    [89, 32],
    [95, 55],
  ],

  // Ladders positions [start, end]
  ladders: [
    [4, 25],
    [13, 46],
    [50, 69],
    [42, 63],
    [62, 81],
    [74, 92],
  ],

  // Board settings
  board: {
    totalSquares: 100,
    rows: 10,
    columns: 10,
  },

  // Game rules
  rules: {
    maxPlayers: 4,
    minPlayers: 1,
    startingPosition: 0,
    winPosition: 100,
    rollToStart: 6,
    maxUndoMoves: 3,
    maxRedoMoves: 3,
    moveHistorySize: 7,
  },
};
