/**
 * Stack-based Move History for Undo/Redo functionality
 * Uses two stacks to manage move history and redo operations
 */
export class MoveHistory {
  constructor(maxSize = 7) {
    this.historyStack = [];
    this.redoStack = [];
    this.maxSize = maxSize;
    this.undoCount = 0;
    this.redoCount = 0;
  }

  /**
   * Add a new move to history
   * @param {Object} move - Move data containing roll, from, and to positions
   */
  addMove(move) {
    this.historyStack.push(move);
    if (this.historyStack.length > this.maxSize) {
      this.historyStack.shift(); // Keep only the last 7 moves
    }
    this.redoStack = []; // Clear redo stack on a new move
  }

  /**
   * Undo the last move
   * @returns {Object|null} Last move data or null if can't undo
   */
  undo() {
    if (this.historyStack.length > 0 && this.undoCount < 3) {
      const lastMove = this.historyStack.pop();
      this.redoStack.push(lastMove);
      this.undoCount++;
      return lastMove;
    }
    return null;
  }

  /**
   * Redo the last undone move
   * @returns {Object|null} Last undone move data or null if can't redo
   */
  redo() {
    if (this.redoStack.length > 0 && this.redoCount < 3) {
      const lastUndoneMove = this.redoStack.pop();
      this.historyStack.push(lastUndoneMove);
      this.redoCount++;
      return lastUndoneMove;
    }
    return null;
  }

  /**
   * Get history of moves
   * @returns {Array} Array of roll numbers in reverse chronological order
   */
  getHistory() {
    return [...this.historyStack].map(move => move.roll).reverse();
  }

  /**
   * Reset all history and counters
   */
  reset() {
    this.historyStack = [];
    this.redoStack = [];
    this.undoCount = 0;
    this.redoCount = 0;
  }
}
