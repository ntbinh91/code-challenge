/**
 * Solution A
 */
var sum_to_n_a = function(n) {
    if (n <= 0) return 0;
    return n * (n + 1) / 2;
};

/**
 * Solution B
 */
var sum_to_n_b = function(n) {
    if (n <= 0) return 0;
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

/**
 * Solution C
 */
var sum_to_n_c = function(n) {
    if (n <= 0) return 0;
    return Array.from({ length: n }, (_, i) => i + 1).reduce((acc, curr) => acc + curr, 0);
};

// Test Cases
console.log("Test Case 1 - Zero: n = 0. Expected result: 0");
console.log("  sum_to_n_a(0):", sum_to_n_a(0));
console.log("  sum_to_n_b(0):", sum_to_n_b(0));
console.log("  sum_to_n_c(0):", sum_to_n_c(0));
console.log();

console.log("Test Case 2 - Single element: n = 1. Expected result: 1");
console.log("  sum_to_n_a(1):", sum_to_n_a(1));
console.log("  sum_to_n_b(1):", sum_to_n_b(1));
console.log("  sum_to_n_c(1):", sum_to_n_c(1));
console.log();

console.log("Test Case 3 - Small positive number: n = 5. Expected result: 15");
console.log("  sum_to_n_a(5):", sum_to_n_a(5));
console.log("  sum_to_n_b(5):", sum_to_n_b(5));
console.log("  sum_to_n_c(5):", sum_to_n_c(5));
console.log();

console.log("Test Case 4 - Medium positive number: n = 100. Expected result: 5050");
console.log("  sum_to_n_a(100):", sum_to_n_a(100));
console.log("  sum_to_n_b(100):", sum_to_n_b(100));
console.log("  sum_to_n_c(100):", sum_to_n_c(100));
console.log();

console.log("Test Case 5 - Big positive number: n = 1000. Expected result: 500500");
console.log("  sum_to_n_a(1000):", sum_to_n_a(1000));
console.log("  sum_to_n_b(1000):", sum_to_n_b(1000));
console.log("  sum_to_n_c(1000):", sum_to_n_c(1000));
console.log();

console.log("Test Case 6 - Negative number: n = -3. Expected result: 0");
console.log("  sum_to_n_a(-3):", sum_to_n_a(-3));
console.log("  sum_to_n_b(-3):", sum_to_n_b(-3));
console.log("  sum_to_n_c(-3):", sum_to_n_c(-3));
console.log();
