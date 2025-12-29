# Problem 1: Three ways to sum to n

## Problem Description

Provide 3 unique implementations of a function that computes the sum of all integers from 1 to n.

## Solutions Overview

### Solution A: Mathematical Formula (Gauss's Formula)

Uses the arithmetic series sum formula: `n * (n + 1) / 2`

```javascript
var sum_to_n_a = function (n) {
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
};
```

### Solution B: Iterative Approach

Uses a for-loop to sum all numbers from 1 to n

```javascript
var sum_to_n_b = function (n) {
  if (n <= 0) return 0;
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};
```

### Solution C: Array Reduce Approach

Creates an array from 1 to n and uses reduce to sum all elements

```javascript
var sum_to_n_c = function (n) {
  if (n <= 0) return 0;
  return Array.from({ length: n }, (_, i) => i + 1).reduce(
    (acc, curr) => acc + curr,
    0
  );
};
```

## Comparison Table

| Solution | Approach             | Time Complexity                                 | Space Complexity                                    | Pros                                                                        | Cons                                                                                        |
| -------- | -------------------- | ----------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **A**    | Mathematical Formula | O(1) - constant time, single calculation        | O(1) - no additional memory used                    | • Fastest execution<br>• Constant time and space<br>• No loops or recursion | • Requires knowledge of formula<br>• Less intuitive                                         |
| **B**    | Iterative Loop       | O(n) - linear time, iterates n times            | O(1) - only uses a single variable for accumulation | • Easy to understand<br>• Minimal memory usage                              | • Linear time complexity<br>• Slower for large n                                            |
| **C**    | Array Reduce         | O(n) - linear time, iterates through n elements | O(n) - creates an array of size n                   | • Functional programming style                                              | • Creates temporary array which causes higher memory usage<br>• Slower than other solutions |

## Testing

Implemented 6 test cases with following `n` values:

- Test Case 1 - Zero: `n = 0`
- Test Case 2 - Single element: `n = 1`
- Test Case 3 - Small positive number: `n = 5`
- Test Case 4 - Medium positive number: `n = 100`
- Test Case 5 - Big positive number: `n = 1000`
- Test Case 6 - Negative number: `n = -3`

Test results:

```javascript
Test Case 1 - Zero: n = 0. Expected result: 0
  sum_to_n_a(0): 0
  sum_to_n_b(0): 0
  sum_to_n_c(0): 0

Test Case 2 - Single element: n = 1. Expected result: 1
  sum_to_n_a(1): 1
  sum_to_n_b(1): 1
  sum_to_n_c(1): 1

Test Case 3 - Small positive number: n = 5. Expected result: 15
  sum_to_n_a(5): 15
  sum_to_n_b(5): 15
  sum_to_n_c(5): 15

Test Case 4 - Medium positive number: n = 100. Expected result: 5050
  sum_to_n_a(100): 5050
  sum_to_n_b(100): 5050
  sum_to_n_c(100): 5050

Test Case 5 - Big positive number: n = 1000. Expected result: 500500
  sum_to_n_a(1000): 500500
  sum_to_n_b(1000): 500500
  sum_to_n_c(1000): 500500

Test Case 6 - Negative number: n = -3. Expected result: 0
  sum_to_n_a(-3): 0
  sum_to_n_b(-3): 0
  sum_to_n_c(-3): 0
```
