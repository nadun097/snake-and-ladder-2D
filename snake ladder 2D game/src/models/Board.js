import { gameConfig } from '../config/gameConfig.js';

/**
 * Node class for Linked List implementation
 * Represents a square on the board with snake/ladder connections
 */
class BoardSquareNode {
  constructor(square, endSquare) {
    this.square = square;           // Current square position
    this.endSquare = endSquare;     // End position after snake/ladder (same as square if no snake/ladder)
    this.next = null;               // Next node in linked list
    this.previous = null;           // Previous node in linked list
    this.players = [];              // Players currently on this square
  }
}

/**
 * Board class using Linked List data structure
 * Manages the game board with 100 squares, snakes, and ladders
 */
export class Board {
  constructor() {
    this.first = null;
    this.last = null;
    this.snakesArray = gameConfig.snakes;
    this.laddersArray = gameConfig.ladders;
    this.players = [];
  }

  /**
   * Insert a square node into the linked list
   * @param {number} square - Current square number
   * @param {number} endSquare - Ending square (after snake/ladder)
   */
  insertSquare(square, endSquare) {
    const newSquare = new BoardSquareNode(square, endSquare);
    
    if (this.first === null) {
      this.first = newSquare;
      this.last = newSquare;
    } else {
      this.last.next = newSquare;
      newSquare.previous = this.last;
      this.last = newSquare;
    }
  }

  /**
   * Handle square insertion with snake/ladder check
   * @param {number} index - Square index to insert
   */
  handleInsertSquare(index) {
    // Check if square has a snake
    for (let i = 0; i < this.snakesArray.length; i++) {
      if (index === this.snakesArray[i][0]) {
        this.insertSquare(index, this.snakesArray[i][1]);
        return;
      }
    }

    // Check if square has a ladder
    for (let i = 0; i < this.laddersArray.length; i++) {
      if (index === this.laddersArray[i][0]) {
        this.insertSquare(index, this.laddersArray[i][1]);
        return;
      }
    }

    // Normal square (no snake/ladder)
    this.insertSquare(index, index);
  }

  /**
   * Find a square node by its ID using linked list traversal
   * @param {number} squareId - Square ID to find
   * @returns {BoardSquareNode|null} Found square node or null
   */
  findSquare(squareId) {
    let current = this.first;
    
    while (current !== null) {
      if (current.square === squareId) {
        return current;
      }
      current = current.next;
    }
    
    return null;
  }

  /**
   * Remove a player from a specific square
   * @param {number} squareId - Square ID to remove player from
   * @param {number} currentPlayerNumber - Player ID to remove
   */
  deleteNodePlayer(squareId, currentPlayerNumber) {
    let current = this.first;
    
    while (current !== null) {
      if (current.square === squareId) {
        current.players = current.players.filter(
          (player) => currentPlayerNumber !== player.id
        );
      }
      current = current.next;
    }
  }

  /**
   * Add a player to their current position square
   * @param {Player} player - Player object to add
   * @param {number} currentPlayerNumber - Current player number
   */
  addPlayers(player, currentPlayerNumber) {
    const startSquare = this.findSquare(player.position);
    
    if (startSquare !== null) {
      startSquare.players.push(player);
      console.log(player);
    }
    
    console.log("update");
    console.log(startSquare?.players);
  }
}
