/**
 * Main Game Controller
 * Manages game flow, player moves, board display, and UI updates
 */
import { gameConfig } from '../config/gameConfig.js';
import { sortByProperty } from '../../data-structures/Sorting.js';

export class Game {
  constructor(board) {
    this.board = board;
    this.players = [];
    this.currentPlayerNumber = 1;
    this.position = 0;
    this.mode = null;
    this.level = null;
    this.answer = null;
    this.mainContainer = document.querySelector(".main-container");
  }

  // ========== Board Management ==========

  /**
   * Create and render the visual game board
   */
  createGameBoard() {
    const boardImg = document.querySelector(".board-img");
    const boardEl = document.querySelector(".board");

    // Clear existing squares
    const squares = boardEl.querySelectorAll(".square");
    squares.forEach((square) => square.remove());

    // Calculate board dimensions
    const [boardWidth, boardHeight] = [
      boardImg.clientWidth,
      boardImg.clientHeight,
    ];
    const squareArea = boardHeight / 10 + boardWidth / 10;

    // Set board styles
    const boardStyles = {
      width: `${boardWidth}px`,
      height: `${boardHeight}px`,
      background: `transparent`,
    };

    for (const [property, value] of Object.entries(boardStyles)) {
      boardEl.style[property] = value;
    }

    // Set square styles
    const squareStyles = {
      width: `${squareArea / 2}px`,
      height: `${squareArea / 2}px`,
      background: `transparent`,
    };

    const ids = this.generateBoardSquaresPattern();

    // Create squares with player discs
    for (const id of ids) {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("square");
      squareDiv.id = `${id}`;

      // Add player discs based on game mode
      for (let i = 1; i <= this.mode; i++) {
        if (this.mode === 1) {
          // Single player mode (player + computer)
          const playerDisc1 = document.createElement("div");
          playerDisc1.classList.add("playerDisc1");
          squareDiv.appendChild(playerDisc1);

          const playerDisc2 = document.createElement("div");
          playerDisc2.classList.add("playerDisc2");
          squareDiv.appendChild(playerDisc2);
          break;
        }

        const playerDisc = document.createElement("div");
        playerDisc.classList.add(`playerDisc${i}`);
        squareDiv.appendChild(playerDisc);
      }

      // Apply styles
      for (const [property, value] of Object.entries(squareStyles)) {
        squareDiv.style[property] = value;
      }

      boardEl.appendChild(squareDiv);
    }
  }

  /**
   * Generate board square IDs in snake-and-ladder pattern
   * @returns {Array} Array of square IDs in correct order
   */
  generateBoardSquaresPattern() {
    const ids = [];

    for (let row = 9; row >= 0; row--) {
      const rowIds = [];
      const startOfRow = row * 10 + 1;
      for (let col = 0; col < 10; col++) {
        rowIds.push(startOfRow + col);
      }
      // Reverse every other row for snake-and-ladder pattern
      if (row % 2 !== 0) {
        rowIds.reverse();
      }
      ids.push(...rowIds);
    }
    return ids;
  }

  /**
   * Hide game board elements
   */
  hideGameBoard() {
    document.querySelector(".board").style.display = "none";
    document.querySelector(".dice").style.display = "none";
  }

  /**
   * Display game board elements
   */
  displayGameBoard() {
    document.querySelector(".board").style.display = "block";
    document.querySelector(".dice").style.display = "block";
  }

  // ========== Player Management ==========

  /**
   * Initialize game with players
   * @param {Array} players - Array of Player objects
   */
  createPlayers(players) {
    this.players = players;
    console.log(this.players);
  }

  // ========== Game Logic ==========

  /**
   * Handle a player's move (dice roll and position update)
   */
  handlePlayerMove() {
    const player = this.players[this.currentPlayerNumber - 1];
    const oldPosition = player.position;

    // Roll dice
    const randNum = Math.floor(Math.random() * 6) + 1;
    player.rolledNumber = randNum;

    let moveData = { roll: randNum, from: oldPosition, to: 0 };

    // Update dice image
    const diceImg = document.querySelector(".dice-img");
    diceImg.src = gameConfig.diceImages[randNum];

    // Remove active class from all player discs
    document
      .querySelectorAll(`.playerDisc${this.currentPlayerNumber}`)
      .forEach((square) => {
        square.classList.remove("active");
      });

    // Handle starting move (need 6 to start)
    if (player.position === 0 && player.rolledNumber === 6) {
      player.position = 1;
      this.board.addPlayer(player, this.currentPlayerNumber);
      const square = document.getElementById("1");
      const playerDisc = square.querySelector(
        `.playerDisc${this.currentPlayerNumber}`
      );
      playerDisc.classList.add("active");
    } 
    // Handle regular moves
    else if (player.position !== 0) {
      if (this.checkWin(player)) {
        this.board.addPlayer(player, this.currentPlayerNumber);
        this.board.removePlayer(
          player.position - player.rolledNumber,
          this.currentPlayerNumber
        );
        const square = document.getElementById(`${player.position}`);
        const playerDisc = square.querySelector(
          `.playerDisc${this.currentPlayerNumber}`
        );
        playerDisc.classList.add("active");

        // Wait for win animation before restarting
        setTimeout(() => this.restartGame(), 5000);
        return;
      }

      this.checkForLaddersOrSnakes(player);
      this.board.addPlayer(player, this.currentPlayerNumber);
      this.board.removePlayer(
        player.position - player.rolledNumber,
        this.currentPlayerNumber
      );
      const square = document.getElementById(`${player.position}`);
      const playerDisc = square.querySelector(
        `.playerDisc${this.currentPlayerNumber}`
      );
      playerDisc.classList.add("active");
    }

    // Save move to history
    moveData.to = player.position;
    player.addMove(moveData);

    this.updateDiceHistoryUI();
    this.updateGridLeaderboard();

    // Update undo/redo button states
    document.querySelector(".redo-btn").disabled = true;
    document.querySelector(".undo-btn").disabled = 
      player.historyStack.length === 0 || 
      player.undoCount >= 3;

    // Switch players if didn't roll a 6
    if (player.rolledNumber !== 6) {
      if (this.mode !== 1) {
        this.currentPlayerNumber =
          this.currentPlayerNumber === this.mode ? 1 : this.currentPlayerNumber + 1;
      } else {
        this.currentPlayerNumber = this.currentPlayerNumber === 2 ? 1 : 2;
      }

      // Update current player highlight
      const playersInGame = document.querySelectorAll(".player-in-game");
      playersInGame.forEach((currentPlayer) => {
        currentPlayer.classList.remove("current");
      });
      playersInGame[this.currentPlayerNumber - 1].classList.add("current");

      // Update undo/redo buttons for next player
      const nextPlayer = this.players[this.currentPlayerNumber - 1];
      const undoBtn = document.querySelector(".undo-btn");
      undoBtn.disabled = 
        nextplayer.historyStack.length === 0 || 
        nextplayer.undoCount >= 3;
      document.querySelector(".redo-btn").disabled = 
        nextplayer.redoStack.length === 0 || 
        nextplayer.redoCount >= 3;
    }

    // Computer's turn (single player mode)
    if (this.players[this.currentPlayerNumber - 1].name === "computer") {
      const diceRollBtn = document.querySelector(".dice-roll-btn");
      diceRollBtn.disabled = true;
      diceRollBtn.classList.add("disable");
      setTimeout(() => {
        this.handlePlayerMove();
        diceRollBtn.disabled = false;
        diceRollBtn.classList.remove("disable");
      }, 800);
    }
  }

  /**
   * Check if player has won the game
   * @param {Player} player - Player to check
   * @returns {boolean} True if player won
   */
  checkWin(player) {
    const newPosition = player.position + player.rolledNumber;

    if (this.level === "E") {
      // Easy mode: any landing on or past 100 wins
      if (newPosition >= 100) {
        player.position = 100;
        player.wins++;
        this.updateLeaderboard();
        this.showWinMessage(player);
        return true;
      } else {
        player.position = newPosition;
        return false;
      }
    } else if (this.level === "M") {
      // Medium mode: must land on or below 100
      if (newPosition === 100) {
        player.position = 100;
        player.wins++;
        this.updateLeaderboard();
        this.showWinMessage(player);
        return true;
      } else if (newPosition < 100) {
        player.position = newPosition;
      }
      return false;
    } else {
      // Hard mode: must land exactly on 100
      if (newPosition === 100) {
        player.position = 100;
        player.wins++;
        this.updateLeaderboard();
        this.showWinMessage(player);
        return true;
      } else if (newPosition > 100) {
        // Bounce back
        const overflow = newPosition - 100;
        player.position = 100 - overflow;
        return false;
      } else {
        player.position = newPosition;
        return false;
      }
    }
  }

  /**
   * Display win message
   * @param {Player} player - Winning player
   */
  showWinMessage(player) {
    const winPopup = document.querySelector(".win-popup");
    const winMessage = document.querySelector(".win-message");
    winMessage.textContent = `WIN - ${player.name}`;
    winPopup.classList.add("show");
    setTimeout(() => winPopup.classList.remove("show"), 5000);
  }

  /**
   * Check and apply snake or ladder at current position
   * Uses: Board.checkSquare() which uses LinkedList internally
   * @param {Player} player - Player to check
   */
  checkForLaddersOrSnakes(player) {
    const squareInfo = this.board.checkSquare(player.position);
    
    if (squareInfo.hasSnake || squareInfo.hasLadder) {
      player.position = squareInfo.endSquare;
    }
  }

  // ========== Undo/Redo Functionality ==========

  /**
   * Undo the last move
   * Uses: Player.undoMove() which uses Stack data structure
   */
  undoMove() {
    const player = this.players[this.currentPlayerNumber - 1];
    const lastMove = player.undoMove();
    const undoBtn = document.querySelector(".undo-btn");
    const redoBtn = document.querySelector(".redo-btn");

    if (lastMove) {
      // Remove player from current position
      this.board.removePlayer(player.position, this.currentPlayerNumber);
      const oldSquare = document.getElementById(`${player.position}`);
      if (oldSquare) {
        oldSquare
          .querySelector(`.playerDisc${this.currentPlayerNumber}`)
          .classList.remove("active");
      }

      // Restore previous position
      player.position = lastMove.from;
      this.board.addPlayer(player, this.currentPlayerNumber);
      if (player.position > 0) {
        const newSquare = document.getElementById(`${player.position}`);
        newSquare
          .querySelector(`.playerDisc${this.currentPlayerNumber}`)
          .classList.add("active");
      }
      this.updateDiceHistoryUI();

      // Update button states
      redoBtn.disabled = false;
      undoBtn.disabled = !player.canUndo();
    }
  }

  /**
   * Redo the last undone move
   * Uses: Player.redoMove() which uses Stack data structure
   */
  redoMove() {
    const player = this.players[this.currentPlayerNumber - 1];
    const undoneMove = player.redoMove();
    const redoBtn = document.querySelector(".redo-btn");

    if (undoneMove) {
      // Remove from old position
      this.board.removePlayer(player.position, this.currentPlayerNumber);
      if (player.position > 0) {
        document
          .getElementById(`${player.position}`)
          .querySelector(`.playerDisc${this.currentPlayerNumber}`)
          .classList.remove("active");
      }

      // Re-apply the move
      player.position = undoneMove.to;
      this.board.addPlayer(player, this.currentPlayerNumber);
      document
        .getElementById(`${player.position}`)
        .querySelector(`.playerDisc${this.currentPlayerNumber}`)
        .classList.add("active");
      this.updateDiceHistoryUI();

      // Update button states
      document.querySelector(".undo-btn").disabled = false;
      redoBtn.disabled = !player.canRedo();
    }
  }

  // ========== Game State Management ==========

  /**
   * Reset all players to starting position
   */
  resetPlayers() {
    this.players.forEach((player) => {
      player.position = 0;
      player.rolledNumber = 0;
      player.resetHistory();
    });
    this.currentPlayerNumber = 1;

    const PlayerNamewon = document.querySelector(".current-player-name");
    PlayerNamewon.textContent = "";

    const imgDice = document.querySelector(".dice-img");
    imgDice.src = gameConfig.diceImages[1];

    document.querySelectorAll(".square div").forEach((disk) => {
      disk.classList.remove("active");
    });
  }

  /**
   * Restart the game
   */
  restartGame() {
    this.resetPlayers();
    this.updateDiceHistoryUI();
    this.updateGridLeaderboard();

    const playersInGame = document.querySelectorAll(".player-in-game");
    playersInGame.forEach((card) => card.classList.remove("current"));
    if (playersInGame.length > 0) {
      playersInGame[0].classList.add("current");
    }

    const undoBtn = document.querySelector(".undo-btn");
    undoBtn.disabled = true;
    document.querySelector(".redo-btn").disabled = true;
  }

  /**
   * Exit to main menu
   */
  existGame() {
    document.querySelector(".in-game-container").style.display = "none";
    document.querySelector(".game_fisrt_interface").style.display = "block";
    document.querySelector(".close-restart-btns").style.display = "none";
    document.querySelector(".leaderboards-wrapper").style.display = "none";
  }

  // ========== UI Updates ==========

  /**
   * Update dice history display for all players
   */
  updateDiceHistoryUI() {
    const playersInGame = document.querySelectorAll(".player-in-game");
    this.players.forEach((player, index) => {
      const playerCard = playersInGame[index];
      const playerInfo = playerCard.querySelector(".player-info");
      let historyContainer = playerInfo.querySelector(".dice-history");
      
      if (!historyContainer) {
        historyContainer = document.createElement("div");
        historyContainer.className = "dice-history";
        playerInfo.appendChild(historyContainer);
      }

      historyContainer.innerHTML = "";
      const history = player.getHistory();

      history.forEach((roll) => {
        const rollDiv = document.createElement("div");
        rollDiv.className = "dice-roll-history-item";
        rollDiv.textContent = roll;
        historyContainer.appendChild(rollDiv);
      });
    });
  }

  /**
   * Update wins leaderboard
   */
  updateLeaderboard() {
    const leaderboardList = document.querySelector(".leaderboard-list");
    leaderboardList.innerHTML = "";

    // Sort players by wins (descending)
    const sortedPlayers = [...this.players].sort((a, b) => b.wins - a.wins);

    sortedPlayers.forEach(player => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <span class="leaderboard-name">${player.name}</span>
        <span class="leaderboard-wins">${player.wins}</span>
      `;
      leaderboardList.appendChild(listItem);
    });
  }

  /**
   * Update grid position leaderboard using stack-based sorting
   */
  /**
   * Update grid position leaderboard using pure sorting algorithm
   * Uses: sortByProperty() from data-structures/Sorting.js
   */
  updateGridLeaderboard() {
    const gridRankingList = document.querySelector(".grid-ranking-list");
    gridRankingList.innerHTML = "";

    // Use pure stack-based sorting algorithm
    // Sort players by position (descending - highest position first)
    const sortedPlayers = sortByProperty(this.players, 'position', false);

    // Display sorted players
    sortedPlayers.forEach(player => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <span class="leaderboard-name">${player.name}</span>
        <span class="leaderboard-wins">Pos: ${player.position}</span>
      `;
      gridRankingList.appendChild(listItem);
    });
  }
}
