// export { Game };
import { diceData } from "./diceData.js";

export class Game {
  players = [];

  position = 0;
  mode;
  level;
  answer;

  constructor(board) {
    this.board = board;
    this.currentPlayerNumber = 1;
    this.mainContainer = document.querySelector(".main-container");
  }

  createGameBoard() {
    const boardImg = document.querySelector(".board-img");
    const boardEl = document.querySelector(".board");

    const squares = boardEl.querySelectorAll(".square");
    squares.forEach((square) => {
      square.remove();
    });

    const [boardWidth, boardHeight] = [
      boardImg.clientWidth,
      boardImg.clientHeight,
    ];
    const squareArea = boardHeight / 10 + boardWidth / 10;
    const boardStyles = {
      width: `${boardWidth}px`,
      height: `${boardHeight}px`,
      background: `transparent`,
    };

    for (const [property, value] of Object.entries(boardStyles)) {
      boardEl.style[property] = value;
    }

    const squareStyles = {
      width: `${squareArea / 2}px`,
      height: `${squareArea / 2}px`,
      background: `transparent`,
    };

    const ids = this.generateBoardSquaresPattern();

    for (const id of ids) {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("square");
      squareDiv.id = `${id}`;

      for (let i = 1; i <= this.mode; i++) {
        if (this.mode == 1) {
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

      for (const [property, value] of Object.entries(squareStyles)) {
        squareDiv.style[property] = value;
      }

      boardEl.appendChild(squareDiv);
    }
  }

  hideGameBoard() {
    document.querySelector(".board").style.display = "none";
    document.querySelector(".dice").style.display = "none";
  }

  displayGameBoard() {
    document.querySelector(".board").style.display = "block";
    document.querySelector(".dice").style.display = "block";
  }

  generateBoardSquaresPattern() {
    const ids = [];

    for (let row = 9; row >= 0; row--) {
      const rowIds = [];
      const startOfRow = row * 10 + 1;
      for (let col = 0; col < 10; col++) {
        rowIds.push(startOfRow + col);
      }
      if (row % 2 !== 0) {
        rowIds.reverse();
      }
      ids.push(...rowIds);
    }
    return ids;
  }

  //prompt the div for selecting the level
  selectLevel() {}

  //prompt the div for selecting the mode
  selectMode() {}

  createPlayers(players) {
    this.players = players;
    console.log(this.players); ///////
  }

  handlePlayerMove() {
    const player = this.players[this.currentPlayerNumber - 1];
    const oldPosition = player.position;

    const randNum = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    player.rolledNumber = randNum;

    // Only record move history for human players
    let moveData = null;
    if (player.name !== "computer") {
      moveData = { roll: randNum, from: oldPosition, to: 0 };
    }

    const diceImg = document.querySelector(".dice-img");
    diceImg.src = diceData[randNum];

    document
      .querySelectorAll(`.playerDisc${this.currentPlayerNumber}`)
      .forEach((square) => {
        square.classList.remove("active");
      });

    if (player.position == 0 && player.rolledNumber == 6) {
      player.position = 1;
      this.board.addPlayers(player, this.currentPlayerNumber);
      const square = document.getElementById("1");
      const playerDisc = square.querySelector(
        `.playerDisc${this.currentPlayerNumber}`
      );
      playerDisc.classList.add("active");
    } else if (player.position != 0) {
      if (this.checkWin(player)) {
        this.board.addPlayers(player, this.currentPlayerNumber);
        this.board.deleteNodePlayer(
          player.position - player.rolledNumber,
          this.currentPlayerNumber
        );
        const square = document.getElementById(`${player.position}`);
        const playerDisc = square.querySelector(
          `.playerDisc${this.currentPlayerNumber}`
        );
        playerDisc.classList.add("active");

        // Wait for the win animation to finish before resetting
        setTimeout(() => this.restartGame(), 5000);
        return;
      }

      this.checkForLaddersOrSnakes(player);
      this.board.addPlayers(player, this.currentPlayerNumber);
      this.board.deleteNodePlayer(
        player.position - player.rolledNumber,
        this.currentPlayerNumber
      );
      const square = document.getElementById(`${player.position}`);
      const playerDisc = square.querySelector(
        `.playerDisc${this.currentPlayerNumber}`
      );
      playerDisc.classList.add("active");
    }

    // Finalize and add the move to history
    moveData.to = player.position;
    player.moveHistory.addMove(moveData);

    this.updateDiceHistoryUI();
    this.updateGridLeaderboard();
    // A new move is made, so disable redo and enable undo if possible
    document.querySelector(".redo-btn").disabled = true;
    document.querySelector(".undo-btn").disabled = player.moveHistory.historyStack.length === 0 || player.moveHistory.undoCount >= 3;

    if (player.rolledNumber !== 6) {
      this.switchPlayer();
    }
  }

  handleComputerTurn() {
    const diceRollBtn = document.querySelector(".dice-roll-btn");
    diceRollBtn.disabled = true;
    diceRollBtn.classList.add("disable");

    // Disable undo/redo buttons during computer's turn
    document.querySelector(".undo-btn").disabled = true;
    document.querySelector(".redo-btn").disabled = true;

    // Show computer is thinking
    const PlayerNamewon = document.querySelector(".current-player-name");
    PlayerNamewon.textContent = "Computer is thinking...";
 
    setTimeout(() => {
      this.handlePlayerMove();
      const computer = this.players[this.currentPlayerNumber - 1];
      
      // Show what computer rolled
      PlayerNamewon.textContent = `Computer rolled ${computer.rolledNumber}`;
 
      // If the computer rolled a 6, schedule another turn
      if (computer.name === "computer" && computer.rolledNumber === 6) {
        setTimeout(() => {
          PlayerNamewon.textContent = "Computer got a 6! Playing again...";
          this.handleComputerTurn();
        }, 1000);
      } else {
        // Switch to human player's turn
        setTimeout(() => {
          this.switchPlayer();
          // Enable dice roll button for human player
          if (this.players[this.currentPlayerNumber - 1].name !== "computer") {
            diceRollBtn.disabled = false;
            diceRollBtn.classList.remove("disable");
            PlayerNamewon.textContent = "Your turn!";
          }
        }, 1000);
      }
    }, 1200);
  }

  switchPlayer() {
    if (this.mode != 1) {
      this.currentPlayerNumber =
        this.currentPlayerNumber == this.mode
          ? 1
          : this.currentPlayerNumber + 1;
    } else {
      this.currentPlayerNumber = this.currentPlayerNumber == 2 ? 1 : 2;
    }

    const playersInGame = document.querySelectorAll(".player-in-game");
    playersInGame.forEach((currentPlayer) => {
      currentPlayer.classList.remove("current");
    });
    playersInGame[this.currentPlayerNumber - 1].classList.add("current");

    const nextPlayer = this.players[this.currentPlayerNumber - 1];
    const undoBtn = document.querySelector(".undo-btn");
    undoBtn.disabled = nextPlayer.moveHistory.historyStack.length === 0 || nextPlayer.moveHistory.undoCount >= 3;
    document.querySelector(".redo-btn").disabled = nextPlayer.moveHistory.redoStack.length === 0 || nextPlayer.moveHistory.redoCount >= 3;

    if (nextPlayer.name === "computer") {
      // It's the computer's turn, disable human controls and start its move.
      const diceRollBtn = document.querySelector(".dice-roll-btn");
      diceRollBtn.disabled = true;
      diceRollBtn.classList.add("disable");
      setTimeout(() => {
        this.handleComputerTurn();
      }, 800);
    }
  }

  showWinPopup(player) {
    const winPopup = document.querySelector(".win-popup");
    const winMessage = document.querySelector(".win-message");
    const winnerAvatar = winPopup.querySelector(".winner-avatar");

    winnerAvatar.src = player.image;
    winMessage.textContent = `WIN - ${player.name}`;
    winPopup.classList.add("show");
    setTimeout(() => winPopup.classList.remove("show"), 5000);
  }

  checkWin(player) {
    const newPosition = player.position + player.rolledNumber;
    if (this.level === "E") {
      if (newPosition === 100 || newPosition > 100) {
        player.position = 100;
        player.wins++;
        this.updateLeaderboard();
        this.showWinPopup(player);
        return true;
      } else {
        player.position = newPosition;
        return false;
      }
    } else if (this.level === "M") {
      if (newPosition === 100) {
        player.position = 100;
        player.wins++;
        this.updateLeaderboard();
        this.showWinPopup(player);
        return true;
      } else if (newPosition < 100) {
        player.position = newPosition;
      }
      return false;
    } else {
      if (newPosition === 100) {
        player.position = 100;
        player.wins++;
        this.updateLeaderboard();
        this.showWinPopup(player);
        return true;
      } else if (newPosition > 100) {
        const owerflow = newPosition - 100;
        player.position = 100 - owerflow;
        return false;
      } else {
        player.position = newPosition;
        return false;
      }
    }
  }

  checkForLaddersOrSnakes(player) {
    let currentPositionNode = this.board.findSquare(player.position);
    let current = currentPositionNode;

    if (current != null) {
      if (currentPositionNode.endSquare < currentPositionNode.square) {
        while (true) {
          if (current.square == currentPositionNode.endSquare) {
            player.position = current.square;
            return;
          }

          current = current.previous;
        }
      } else if (currentPositionNode.endSquare > currentPositionNode.square) {
        while (true) {
          if (current.square == currentPositionNode.endSquare) {
            player.position = current.square;
            return;
          }

          current = current.next;
        }
      }
    }
  }

  resetPlayers() {
    this.players.forEach((player) => {
      player.position = 0;
      player.rolledNumber = 0;
      player.moveHistory.reset();
    });
    this.currentPlayerNumber = 1;
    // const currentPlayerNameEl = document.querySelector(".current-player-name");
    // currentPlayerNameEl.textContent = `${
    //   this.players[this.currentPlayerNumber - 1].name
    // }'s turn: `;

    const PlayerNamewon = document.querySelector(".current-player-name");
    PlayerNamewon.textContent = "";

    const imgDice = document.querySelector(".dice-img");
    imgDice.src = diceData[1];

    document.querySelectorAll(".square div").forEach((disk) => {
      disk.classList.remove("active");
    });
  }

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

      historyContainer.innerHTML = ""; // Clear previous history
      const history = player.moveHistory.getHistory();

      history.forEach((roll) => {
        const rollDiv = document.createElement("div");
        rollDiv.className = "dice-roll-history-item";
        const rollImg = document.createElement("img");
        rollImg.src = diceData[roll];
        rollDiv.appendChild(rollImg);
        historyContainer.appendChild(rollDiv);
      });
    });
  }

  undoMove() {
    const player = this.players[this.currentPlayerNumber - 1];
    const lastMove = player.moveHistory.undo();
    const undoBtn = document.querySelector(".undo-btn");
    const redoBtn = document.querySelector(".redo-btn");

    if (lastMove) {
      // Remove player from new position
      this.board.deleteNodePlayer(player.position, this.currentPlayerNumber);
      const oldSquare = document.getElementById(`${player.position}`);
      if (oldSquare) {
        oldSquare
          .querySelector(`.playerDisc${this.currentPlayerNumber}`)
          .classList.remove("active");
      }

      // Restore old position
      player.position = lastMove.from;
      this.board.addPlayers(player, this.currentPlayerNumber);
      if (player.position > 0) {
        const newSquare = document.getElementById(`${player.position}`);
        newSquare
          .querySelector(`.playerDisc${this.currentPlayerNumber}`)
          .classList.add("active");
      }
      this.updateDiceHistoryUI();

      // Update button states
      redoBtn.disabled = false;
      if (player.moveHistory.historyStack.length === 0 || player.moveHistory.undoCount >= 3) {
        undoBtn.disabled = true;
      }
    }
  }

  redoMove() {
    const player = this.players[this.currentPlayerNumber - 1];
    const undoneMove = player.moveHistory.redo();
    const redoBtn = document.querySelector(".redo-btn");

    if (undoneMove) {
      // Remove from old position
      this.board.deleteNodePlayer(player.position, this.currentPlayerNumber);
      if (player.position > 0) {
        document
          .getElementById(`${player.position}`)
          .querySelector(`.playerDisc${this.currentPlayerNumber}`)
          .classList.remove("active");
      }

      // Re-apply the move
      player.position = undoneMove.to;
      this.board.addPlayers(player, this.currentPlayerNumber);
      document.getElementById(`${player.position}`).querySelector(`.playerDisc${this.currentPlayerNumber}`).classList.add("active");
      this.updateDiceHistoryUI();

      // Update button states
      document.querySelector(".undo-btn").disabled = false;
      if (player.moveHistory.redoStack.length === 0 || player.moveHistory.redoCount >= 3) {
        redoBtn.disabled = true;
      }
    }
  }

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

  updateLeaderboard() {
    const leaderboardList = document.querySelector(".leaderboard-list");
    leaderboardList.innerHTML = ""; // Clear existing list

    // Sort players by wins in descending order
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

  updateGridLeaderboard() {
    const gridRankingList = document.querySelector(".grid-ranking-list");
    gridRankingList.innerHTML = "";

    // --- Stack-based sorting algorithm (Insertion Sort) ---
    const mainStack = [...this.players];
    const sortedStack = [];

    while (mainStack.length > 0) {
      const tempPlayer = mainStack.pop();

      // Move players from sortedStack back to mainStack if they have a lower position
      while (sortedStack.length > 0 && sortedStack[sortedStack.length - 1].position > tempPlayer.position) {
        mainStack.push(sortedStack.pop());
      }
      sortedStack.push(tempPlayer);
    }
    // The sortedStack now holds players sorted by position in descending order.
    // We will display them by popping from the stack.

    while (sortedStack.length > 0) {
      const player = sortedStack.pop();
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <span class="leaderboard-name">${player.name}</span>
        <span class="leaderboard-wins">Pos: ${player.position}</span>
      `;
      gridRankingList.appendChild(listItem);
    }
  }

  existGame() {
    document.querySelector(".in-game-container").style.display = "none";
    document.querySelector(".game_fisrt_interface").style.display = "block";
    document.querySelector(".close-restart-btns").style.display = "none";
    document.querySelector(".leaderboards-wrapper").style.display = "none";
  }
}
