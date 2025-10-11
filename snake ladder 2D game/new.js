// Stack-based Move History for Undo/Redo
class MoveHistory {
  constructor(maxSize = 7) {
    this.historyStack = [];
    this.redoStack = [];
    this.maxSize = maxSize;
    this.undoCount = 0;
    this.redoCount = 0;
  }

  addMove(move) {
    this.historyStack.push(move);
    if (this.historyStack.length > this.maxSize) {
      this.historyStack.shift(); // Keep only the last 7 moves
    }
    this.redoStack = []; // Clear redo stack on a new move
  }

  undo() {
    if (this.historyStack.length > 0 && this.undoCount < 3) {
      const lastMove = this.historyStack.pop();
      this.redoStack.push(lastMove);
      this.undoCount++;
      return lastMove;
    }
    return null;
  }

  redo() {
    if (this.redoStack.length > 0 && this.redoCount < 3) {
      const lastUndoneMove = this.redoStack.pop();
      this.historyStack.push(lastUndoneMove);
      this.redoCount++;
      return lastUndoneMove;
    }
    return null;
  }

  getHistory() {
    // Return a reversed copy to show newest first
    return [...this.historyStack].map(move => move.roll).reverse();
  }

  reset() {
    this.historyStack = [];
    this.redoStack = [];
    this.undoCount = 0;
    this.redoCount = 0;
  }
}

//player class
export class Player {
  constructor(name, color, image, id) {
    this.name = name;
    this.position = 0;
    this.rolledNumber = 0;
    this.color = color;
    this.image = image;
    this.id = id;
    this.moveHistory = new MoveHistory(7);
    this.wins = 0;
  }
}

//clas SnakesladdersLink

class SnakesladdersLink {
  constructor(square, endSquare) {
    this.square = square;
    this.endSquare = endSquare;
    this.next = null;
    this.previous = null;
    this.players = [];
  }
}



export class Board {
  constructor() {
    this.first = null;
    this.last = null;
    this.snakesarray = [
      [20, 6],
      [39, 3],
      [77, 37],
      [89, 32],
      [95, 55],
    ];
    this.laddersArray = [
      [4, 25],
      [13, 46],
      [50, 69],
      [42, 63],
      [62, 81],
      [74, 92],
    ];
    this.players = [];
  }

  //findsquare

  insertSquare(Square, endSquare) {
    const newSquare = new SnakesladdersLink(Square, endSquare);
    if (this.first == null) {
      this.first = newSquare;
      this.last = newSquare;
    } else {
      this.last.next = newSquare;
      newSquare.previous = this.last;
      this.last = newSquare;
    }
  }

  //displaySquare

  handleInsertSquare(index) {
    for (let i = 0; i < this.snakesarray.length; i++) {
      if (index == this.snakesarray[i][0]) {
        this.insertSquare(index, this.snakesarray[i][1]);
        return;
      }
    }

    for (let i = 0; i < this.laddersArray.length; i++) {
      if (index == this.laddersArray[i][0]) {
        this.insertSquare(index, this.laddersArray[i][1]);
        return;
      }
    }

    this.insertSquare(index, index);
  }

  findSquare(Squareid) {
    // alert("ddvdv");
    let findlink = this.first;
    while (findlink != null) {
      if (findlink.square == Squareid) {
        return findlink;
      } else {
        findlink = findlink.next;
      }
    }
    return null;
  }

  deleteNodePlayer(Squareid, currentPlayerNumber) {
    let current = this.first;
    while (current != null) {
      if (current.square == Squareid) {
        // current.players[currentPlayerNumber - 1] = null;
        current.players = current.players.filter(
          (player) => currentPlayerNumber != player.id
        );
        // return;
      }
      current = current.next;
    }
  }

  addPlayers(player, currentPlayerNumber) {
    // this.players.push(player);
    let startSquare = this.findSquare(player.position);
    if (startSquare != null) {
      startSquare.players.push(player);
      console.log(player);
      // startSquare.players[currentPlayerNumber - 1] = player;
    }
    console.log("update");
    console.log(startSquare.players);
  }
}
