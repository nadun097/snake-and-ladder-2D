/**
 * ============================================
 * SORTING ALGORITHMS
 * ============================================
 * 

/**
 * Stack-Based Insertion Sort
 * 
 * Sorts an array using two stacks (main and sorted).
 * This demonstrates how sorting can be done using only stack operations.
 * 
 * Algorithm:
 * 1. Push all elements to main stack
 * 2. Pop from main stack
 * 3. While sorted stack top is greater than current, move to main
 * 4. Push current to sorted stack
 * 5. Repeat until main stack is empty

 */
export function stackBasedInsertionSort(array, compareFn = (a, b) => a - b) {
  if (!array || array.length <= 1) {
    return array;
  }

  // Main stack (input)
  const mainStack = [...array];
  // Sorted stack (output)
  const sortedStack = [];

  while (mainStack.length > 0) {
    // Pop element from main stack
    const temp = mainStack.pop();

    // Move elements from sorted stack back to main stack
    // while they are greater than temp (for ascending order)
    while (sortedStack.length > 0 && 
           compareFn(sortedStack[sortedStack.length - 1], temp) > 0) {
      mainStack.push(sortedStack.pop());
    }

    // Push temp to sorted stack
    sortedStack.push(temp);
  }

  return sortedStack;
}


export function sortByProperty(array, property, ascending = true) {
  const compareFn = ascending
    ? (a, b) => a[property] - b[property]
    : (a, b) => b[property] - a[property];
  
  return stackBasedInsertionSort(array, compareFn);
}

/**
 * Example Usage:
 * 
 * // Sort numbers
 * const numbers = [5, 2, 8, 1, 9];
 * const sorted = stackBasedInsertionSort(numbers);
 * console.log(sorted); // [1, 2, 5, 8, 9]
 * 
 * // Sort objects
 * const players = [
 *   { name: 'Alice', score: 10 },
 *   { name: 'Bob', score: 25 },
 *   { name: 'Charlie', score: 15 }
 * ];
 * const sorted = sortByProperty(players, 'score', false);
 * // Result: Bob (25), Charlie (15), Alice (10)
 */
