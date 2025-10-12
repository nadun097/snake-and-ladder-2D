/**
 * ============================================
 * BOARD - GAME LOGIC
 * ============================================
 * 
 * Manages the game board using the Linked List data structure.
 * This file contains game-specific logic built on top of pure DS.
 * 
 * Data Structure Used: Doubly Linked List
 * Purpose: Manage 100 squares with snakes and ladders
 */

import { LinkedList } from '../../data-structures/LinkedList.js';
import { gameConfig } from '../config/gameConfig.js';

/**
 * Board Square Data
 * Represents data stored in each linked list node
 */
class BoardSquareData {
  constructor(square, endSquare) {
    this.square = square;           // Current square position (1-100)
    this.endSquare = endSquare;     // End position after snake/ladder
    this.players = [];              // Players on this square
  }

  /**
   * Check if this square has a snake
   */
  isSnake() {
    return this.endSquare < this.square;
  }

  /**
   * Check if this square has a ladder
   */
  isLadder() {
    return this.endSquare > this.square;
  }

  /**
   * Check if this is a normal square
   */
  isNormal() {
    return this.endSquare === this.square;
  }
}

/**
 * Board class - manages the game board
 * Uses Linked List data structure for square management
 */
export class Board {
  constructor() {
    this.boardList = new LinkedList();  // Uses pure Linked List DS
    this.snakesArray = gameConfig.snakes;
    this.laddersArray = gameConfig.ladders;
  }

  /**
   * Insert a square into the board
   * @param {number} square - Square number
   * @param {number} endSquare - End square after snake/ladder
   */
  insertSquare(square, endSquare) {
    const squareData = new BoardSquareData(square, endSquare);
    this.boardList.insertAtEnd(squareData);
  }

  /**
   * Handle square insertion with automatic snake/ladder detection
   * @param {number} index - Square index (1-100)
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
   * Find a square by its number using linked list search
   * @param {number} squareId - Square number to find
   * @returns {Object|null} Square node data or null
   */
  findSquare(squareId) {
    const node = this.boardList.find(data => data.square === squareId);
    return node ? node.data : null;
  }

  /**
   * Find the end position of a snake/ladder using traversal
   * @param {number} startSquare - Starting square number
   * @returns {number} End square number
   */
  findEndPosition(startSquare) {
    const squareData = this.findSquare(startSquare);
    
    if (!squareData) {
      return startSquare;
    }

    return squareData.endSquare;
  }

  /**
   * Check if a square has a snake or ladder
   * @param {number} squareId - Square number
   * @returns {Object} { hasSnake: boolean, hasLadder: boolean, endSquare: number }
   */
  checkSquare(squareId) {
    const squareData = this.findSquare(squareId);
    
    if (!squareData) {
      return { hasSnake: false, hasLadder: false, endSquare: squareId };
    }

    return {
      hasSnake: squareData.isSnake(),
      hasLadder: squareData.isLadder(),
      endSquare: squareData.endSquare
    };
  }

  /**
   * Add a player to a square
   * @param {Object} player - Player object
   * @param {number} playerNumber - Player number
   */
  addPlayer(player, playerNumber) {
    const squareData = this.findSquare(player.position);
    
    if (squareData) {
      squareData.players.push(player);
      console.log(`Player ${player.name} added to square ${player.position}`);
    }
  }

  /**
   * Remove a player from a square
   * @param {number} squareId - Square number
   * @param {number} playerNumber - Player number
   */
  removePlayer(squareId, playerNumber) {
    const node = this.boardList.find(data => data.square === squareId);
    
    if (node) {
      node.data.players = node.data.players.filter(
        player => player.id !== playerNumber
      );
    }
  }

  /**
   * Get all players on a square
   * @param {number} squareId - Square number
   * @returns {Array} Array of players
   */
  getPlayersOnSquare(squareId) {
    const squareData = this.findSquare(squareId);
    return squareData ? squareData.players : [];
  }

  /**
   * Get total number of squares
   * @returns {number} Number of squares
   */
  getTotalSquares() {
    return this.boardList.getSize();
  }

  /**
   * Clear all players from all squares
   */
  clearAllPlayers() {
    const allSquares = this.boardList.toArray();
    allSquares.forEach(square => {
      square.players = [];
    });
  }
}
