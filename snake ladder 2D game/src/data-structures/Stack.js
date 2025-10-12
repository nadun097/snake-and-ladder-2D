/**
 * ============================================
 * STACK DATA STRUCTURE
 * ============================================
 * 
 * A pure implementation of a Stack (LIFO - Last In, First Out).
 * Used for managing sequential operations that need to be undone/redone.
 * 
 * Time Complexity:
 * - Push: O(1)
 * - Pop: O(1)
 * - Peek: O(1)
 * - isEmpty: O(1)
 * 
 * Space Complexity: O(n) where n is number of elements
 * 
 * Use Case: Undo/Redo operations, expression evaluation, backtracking
 */


export class Stack {

  constructor(maxSize = Infinity) {
    this.items = [];
    this.maxSize = maxSize;
  }


  push(element) {
    if (this.isFull()) {
      // If stack is full, remove oldest element (bottom)
      if (this.maxSize !== Infinity) {
        this.items.shift();
      } else {
        return false;
      }
    }
    
    this.items.push(element);
    return true;
  }


  pop() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items.pop();
  }


  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.items.length - 1];
  }


  isEmpty() {
    return this.items.length === 0;
  }


  isFull() {
    return this.items.length >= this.maxSize;
  }


  size() {
    return this.items.length;
  }


  clear() {
    this.items = [];
  }


  toArray() {
    return [...this.items].reverse();
  }


  toArrayReverse() {
    return [...this.items];
  }
}

/**
 * Example Usage:
 * 
 * const stack = new Stack(5);
 * stack.push(10);
 * stack.push(20);
 * stack.push(30);
 * 
 * console.log(stack.peek()); // 30
 * console.log(stack.pop());  // 30
 * console.log(stack.size()); // 2
 */
