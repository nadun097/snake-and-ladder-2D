/**
 * ============================================
 * DOUBLY LINKED LIST DATA STRUCTURE
 * ============================================
 * 
 * A pure implementation of a doubly linked list.
 * Each node has references to both next and previous nodes.
 * 
 * Time Complexity:
 * - Insert at end: O(1)
 * - Search: O(n)
 * - Delete: O(n)
 * - Traverse: O(n)
 * 
 * Space Complexity: O(n) where n is number of nodes
 * 
 * Use Case: Representing sequential data with bidirectional traversal
 */

export class LinkedListNode {
 
  constructor(data) {
    this.data = data;
    this.next = null;
    this.previous = null;
  }
}

/**
 * Doubly Linked List Implementation
 */
export class LinkedList {
  constructor() {
    this.head = null;  // First node
    this.tail = null;  // Last node
    this.size = 0;
  }


  insertAtEnd(data) {
    const newNode = new LinkedListNode(data);
    
    if (this.head === null) {
      // Empty list
      this.head = newNode;
      this.tail = newNode;
    } else {
      // Add to end
      this.tail.next = newNode;
      newNode.previous = this.tail;
      this.tail = newNode;
    }
    
    this.size++;
    return newNode;
  }


  find(matchFn) {
    let current = this.head;
    
    while (current !== null) {
      if (matchFn(current.data)) {
        return current;
      }
      current = current.next;
    }
    
    return null;
  }


  traverseForward(startNode, matchFn) {
    let current = startNode;
    
    while (current !== null) {
      if (matchFn(current.data)) {
        return current;
      }
      current = current.next;
    }
    
    return null;
  }

 
  traverseBackward(startNode, matchFn) {
    let current = startNode;
    
    while (current !== null) {
      if (matchFn(current.data)) {
        return current;
      }
      current = current.previous;
    }
    
    return null;
  }

 
  toArray() {
    const array = [];
    let current = this.head;
    
    while (current !== null) {
      array.push(current.data);
      current = current.next;
    }
    
    return array;
  }

 
  getSize() {
    return this.size;
  }

  
  isEmpty() {
    return this.size === 0;
  }


  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
}

/**
 * Example Usage:
 * 
 * const list = new LinkedList();
 * list.insertAtEnd({ id: 1, value: 'A' });
 * list.insertAtEnd({ id: 2, value: 'B' });
 * 
 * const node = list.find(data => data.id === 2);
 * console.log(node.data); // { id: 2, value: 'B' }
 */
