/**
 * ============================================
 * PLAYER - GAME ENTITY
 * ============================================
 * 
 * Represents a player in the game.
 * Uses Stack data structure for move history (undo/redo).
 * 
 * Data Structure Used: Stack (for move history)
 * Purpose: Manage player state and move history
 */

import { Stack } from '../../data-structures/Stack.js';

/**
 * Player class
 * Represents a player with move history management
 */
export class Player {
  constructor(name, color, image, id) {
    this.name = name;
    this.position = 0;
    this.rolledNumber = 0;
    this.color = color;
    this.image = image;
    this.id = id;
    this.wins = 0;
    
    // Move history using Stack data structure
    this.historyStack = new Stack(7);  // Max 7 moves
    this.redoStack = new Stack(7);     // Max 7 redo moves
    this.undoCount = 0;
    this.redoCount = 0;
  }

  /**
   * Record a move in history
   * @param {Object} moveData - { roll, from, to }
   */
  addMove(moveData) {
    this.historyStack.push(moveData);
    this.redoStack.clear();  // Clear redo when new move is made
  }

  /**
   * Undo the last move
   * @returns {Object|null} Move data or null if can't undo
   */
  undoMove() {
    if (this.historyStack.isEmpty() || this.undoCount >= 3) {
      return null;
    }

    const lastMove = this.historyStack.pop();
    this.redoStack.push(lastMove);
    this.undoCount++;
    
    return lastMove;
  }

  /**
   * Redo the last undone move
   * @returns {Object|null} Move data or null if can't redo
   */
  redoMove() {
    if (this.redoStack.isEmpty() || this.redoCount >= 3) {
      return null;
    }

    const lastUndone = this.redoStack.pop();
    this.historyStack.push(lastUndone);
    this.redoCount++;
    
    return lastUndone;
  }

  /**
   * Get move history (most recent first)
   * @returns {Array} Array of roll numbers
   */
  getHistory() {
    return this.historyStack.toArray().map(move => move.roll);
  }

  /**
   * Reset move history and counters
   */
  resetHistory() {
    this.historyStack.clear();
    this.redoStack.clear();
    this.undoCount = 0;
    this.redoCount = 0;
  }

  /**
   * Check if undo is available
   * @returns {boolean}
   */
  canUndo() {
    return !this.historyStack.isEmpty() && this.undoCount < 3;
  }

  /**
   * Check if redo is available
   * @returns {boolean}
   */
  canRedo() {
    return !this.redoStack.isEmpty() && this.redoCount < 3;
  }

  /**
   * Reset undo/redo counts (called when turn ends)
   */
  resetCounts() {
    this.undoCount = 0;
    this.redoCount = 0;
  }
}
