# Problem 3: Messy React

## Problem Description

List out the computational inefficiencies and anti-patterns found in the code block.

## Summary

Found **17 issues** grouped into 5 categories:

- **A. Critical Bugs** (4 issues) - Will cause runtime or compile errors
- **B. Logic Errors** (1 issue) - Incorrect behavior
- **C. Performance Issues** (5 issues) - Wasteful computation and unnecessary re-renders
- **D. React Anti-Patterns** (2 issues) - Incorrect React patterns
- **E. TypeScript/Code Quality** (5 issues) - Type safety and code quality problems

**Note**: All necessary imports are assumed to be properly added (React, useMemo, BoxProps, etc.). Import-related issues are not included in this analysis.

## Issues Found

### A. Critical Bugs (Will Cause Runtime or Compile Errors)

#### 1. Missing Type Definition for `WalletBalance`

**Problematic code:**

```typescript
interface WalletBalance {
  currency: string;
  amount: number;
  // Missing: blockchain property
}

// Later used as:
const balancePriority = getPriority(balance.blockchain); // Error!
```

**Fixed code:**

```typescript
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added!
}
```

- **Issue**: The `WalletBalance` interface lacks the `blockchain` property, yet this property is accessed when calling `getPriority(balance.blockchain)`.
- **Impact**: TypeScript compilation error - property doesn't exist on type.
- **Fix**: Add `blockchain: string` to the interface.

#### 2. Filter Logic Issues: Undefined Variable + Inverted Condition

**Problematic code:**

```typescript
return balances.filter((balance: WalletBalance) => {
  // Issue 1: lhsPriority is not defined, balancePriority should be used instead
  const balancePriority = getPriority(balance.blockchain);
  if (lhsPriority > -99) {
    // Issue 2: Wrong condition! Keeps negative/zero amounts
    if (balance.amount <= 0) {
      return true;
    }
  }
  return false;
});
```

**Fixed code:**

```typescript
return balances.filter((balance: WalletBalance) => {
  // Fixed: use balancePriority instead
  const balancePriority = getPriority(balance.blockchain);
  if (balancePriority > -99) {
    // Fixed: keep only positive amounts
    if (balance.amount > 0) {
      return true;
    }
  }
  return false;
});

// Or a simplified solution:
return balances.filter((balance: WalletBalance) => {
  const balancePriority = getPriority(balance.blockchain);
  return balancePriority > -99 && balance.amount > 0;
});
```

- **Issues**:
  1. `lhsPriority` is not defined, `balancePriority` should be used instead
  2. Filter condition `balance.amount <= 0` is inverted - keeps zero/negative balances instead of filtering them out
- **Impact**:
  1. Runtime error - ReferenceError: lhsPriority is not defined
  2. Incorrect behavior - displays wallets with zero or negative amounts
- **Fix**: Update filter condition with following:
  1. Replace `lhsPriority` with `balancePriority`
  2. Change balance's amount condition to `balance.amount > 0`.

#### 3. Unused formattedBalances + Type Mismatch in rows

**Problematic code:**

```typescript
// Issue 1: This array is created but never used
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed(),
  };
});

// Issue 2: Maps over wrong array (sortedBalances instead of formattedBalances)
const rows = sortedBalances.map(
  (balance: FormattedWalletBalance, index: number) => {
    // balance.formatted doesn't exist on WalletBalance!
    return (
      <WalletRow
        formattedAmount={balance.formatted} // Error!
      />
    );
  }
);
```

**Fixed code (Option 1 - Use formattedBalances properly):**

```typescript
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed(),
  };
});

// Now map over formattedBalances with proper memoization
const rows = useMemo(() => {
  return formattedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted} // Now works!
      />
    );
  });
}, [formattedBalances, prices]);
```

**Fixed code (Option 2 - Remove formattedBalances, format inline):**

```typescript
// Remove formattedBalances entirely, format inline with proper memoization
const rows = useMemo(() => {
  return sortedBalances.map((balance: WalletBalance) => {
    const formatted = balance.amount.toFixed();
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={formatted}
      />
    );
  });
}, [sortedBalances, prices]);
```

- **Issues**:
  1. `formattedBalances` is computed but never used - entire array created and abandoned
  2. `rows` maps over `sortedBalances` (`WalletBalance` type) but parameter is typed as `FormattedWalletBalance`
- **Impact**:
  1. Wasted computation and memory allocation
  2. TypeScript error and runtime error when accessing `balance.formatted`
- **Fix**: Either use `formattedBalances` properly in the rows mapping (Option 1), or remove it and format inline (Option 2).

#### 4. Missing `classes` Definition

**Problematic code:**

```typescript
return (
  <WalletRow
    className={classes.row} // classes is not defined!
  />
);
```

**Fixed code (Option 1 - Remove className):**

```typescript
return (
  <WalletRow
  // Remove className if not necessary
  />
);
```

**Fixed code (Option 2 - Define classes):**

```typescript
// E.g: we're using Material-UI. Let's define style using makeStyles
const useStyles = makeStyles({
  row: {
    // any styles here
  },
});

const WalletPage: React.FC<BoxProps> = (props) => {
  // Then use useStyles hook to declare `classes` variable
  const classes = useStyles();
  // ... rest of component
};
```

- **Issue**: `classes.row` is used but `classes` is never defined.
- **Impact**: Runtime error - Cannot read property 'row' of undefined.
- **Fix**: Define `classes` or remove if not needed.

### B. Logic Errors

#### 5. Missing Return Value in Sort Function

**Problematic code:**

```typescript
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  if (leftPriority > rightPriority) {
    return -1;
  } else if (rightPriority > leftPriority) {
    return 1;
  }
  // Missing: return 0 when priorities are equal
});
```

**Fixed code (Option 1 - Add return 0):**

```typescript
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  if (leftPriority > rightPriority) {
    return -1;
  } else if (rightPriority > leftPriority) {
    return 1;
  }
  return 0; // Added!
});
```

**Fixed code (Option 2 - Simplified):**

```typescript
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
  return getPriority(rhs.blockchain) - getPriority(lhs.blockchain); // Descending order
});
```

- **Issue**: Sort comparator doesn't explicitly return `0` when priorities are equal.
- **Impact**: Undefined behavior when priorities match - sort order becomes unstable.
- **Fix**: Add explicit `return 0` for the equal case.

### C. Performance Issues

#### 6. Rows Not Memoized

**Problematic code:**

```typescript
const rows = sortedBalances.map(
  (balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  }
);
```

**Fixed code:**

```typescript
const rows = useMemo(() => {
  return sortedBalances.map((balance: WalletBalance) => {
    const formatted = balance.amount.toFixed();
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={formatted}
      />
    );
  });
}, [sortedBalances, prices, classes]);
```

- **Issue**: `rows` array is not memorized - React elements are recreated on every render regardless of whether dependencies changed.
- **Impact**: Performance degradation - unnecessary re-creation of React elements on every component render, even when `sortedBalances` and `prices` haven't changed.
- **Fix**: Wrap the rows computation in `useMemo` with appropriate dependencies `[sortedBalances, prices, classes]` to only recreate elements when necessary.

#### 7. Inefficient useMemo Dependencies

**Problematic code:**

```typescript
const sortedBalances = useMemo(() => {
  return balances
    .filter((balance: WalletBalance) => {
      // ... filtering logic
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      // ... sorting logic
    });
}, [balances, prices]); // prices is not used in the computation function
```

**Fixed code:**

```typescript
const sortedBalances = useMemo(() => {
  return balances
    .filter((balance: WalletBalance) => {
      // ... filtering logic
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      // ... sorting logic
    });
}, [balances]); // Removed prices from dependencies
```

- **Issue**: `prices` is included in the dependency array but never used in the `sortedBalances` computation.
- **Impact**: Unnecessary re-computation of sorting/filtering when `prices` changes, even though it doesn't affect the result.
- **Fix**: Remove `prices` from dependency array: `[balances, prices]` → `[balances]`.

#### 8. Redundant getPriority Calls

**Problematic code:**

```typescript
return balances
  .filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain); // Call #1
    // ...
  })
  .sort((lhs: WalletBalance, rhs: WalletBalance) => {
    const leftPriority = getPriority(lhs.blockchain); // Call #2
    const rightPriority = getPriority(rhs.blockchain); // Call #3
    // For each comparison during sort!
  });
```

**Fixed code:**

```typescript
// Declare new type extended from WalletBalance
interface WalletBalanceWithPriority extends WalletBalance {
  priority: number;
}

// Compute priority once per balance
const balancesWithPriority: WalletBalanceWithPriority[] = balances.map(
  (balance: WalletBalance) => ({
    ...balance,
    priority: getPriority(balance.blockchain),
  })
);

return balancesWithPriority
  .filter((balance) => balance.priority > -99 && balance.amount > 0) // Use cached priority
  .sort((lhs, rhs) => rhs.priority - lhs.priority); // Use cached priority
```

- **Issue**: `getPriority` is called multiple times (3 times) for the same balance during filtering and sorting.
- **Impact**: Wasteful computation. For 100 items, this could mean ~700 function calls instead of 100:
  - **Filter phase**: 100 calls (once per item to check `balancePriority > -99`)
  - **Sort phase**: ~664 calls (quicksort makes ~n log n comparisons = 100 × log₂(100) ≈ 332 comparisons, each calling `getPriority` twice for left and right)
  - **Total**: ~764 calls instead of just 100 if priorities were cached
- **Fix**: Compute priority once per balance and cache it using map before filter/sort.

#### 9. Multiple Array Iterations

**Problematic code:**

```typescript
// Iteration 1: filter
const sortedBalances = balances.filter(...)
  // Iteration 2: sort
  .sort(...)

// Iteration 3: map (unused)
const formattedBalances = sortedBalances.map(...)

// Iteration 4: map
const rows = sortedBalances.map(...)
```

**Fixed code:**

```typescript
// Combine into 3 iterations (filter, sort, map for rendering)
const sortedBalances = useMemo(() => {
  return (
    balances
      // Iteration 1: filter
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      // Iteration 2: sort
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        return getPriority(rhs.blockchain) - getPriority(lhs.blockchain);
      })
  );
}, [balances]);

// Iteration 3: map (rows)
const rows = useMemo(() => {
  return sortedBalances.map((balance: WalletBalance) => {
    const formatted = balance.amount.toFixed(); // Format inline
    const usdValue = prices[balance.currency] * balance.amount;
    return <WalletRow key={balance.currency} {...props} />;
  });
}, [sortedBalances, prices]);
```

- **Issue**: The code performs 4 separate array iterations: filter → sort → map (formattedBalances) → map (rows).
- **Impact**: Unnecessary extra iteration - the `formattedBalances` array is created but never used, wasting computation.
- **Fix**: Combine operations where possible. Eliminate the unused `formattedBalances` step and combine formatting with row rendering.

### D. React Anti-Patterns

#### 10. Using Index as Key

**Problematic code:**

```typescript
const rows = sortedBalances.map(
  (balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        key={index} // Bad! Using array index as key
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  }
);
```

**Fixed code:**

```typescript
const rows = sortedBalances.map((balance: WalletBalance) => {
  const usdValue = prices[balance.currency] * balance.amount;
  const formatted = balance.amount.toFixed();
  return (
    <WalletRow
      key={balance.currency} // Use unique identifier. we can determine other key values if currency is not unique.
      amount={balance.amount}
      usdValue={usdValue}
      formattedAmount={formatted}
    />
  );
});
```

- **Issue**: Using array `index` as React key prop.
- **Impact**: Can cause rendering bugs, incorrect component state, and poor reconciliation performance when list order changes.
- **Fix**: Use a unique, stable identifier like `balance.currency` or a combination of properties.

#### 11. Function Defined Inside Component

**Problematic code:**

```typescript
const WalletPage: React.FC<BoxProps> = (props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // getPriority is re-created on every render
  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };
};
```

**Fixed code (Option 1 - Move outside component):**

```typescript
// Define outside component - only created once
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<BoxProps> = (props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances.filter(...).sort(...);
  }, [balances]);
};
```

**Fixed code (Option 2 - Use useCallback):**

```typescript
const WalletPage: React.FC<BoxProps> = (props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Memoize the function
  const getPriority = useCallback((blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  }, []); // Empty deps - function never changes

  const sortedBalances = useMemo(() => {
    return balances.filter(...).sort(...);
  }, [balances, getPriority]);
};
```

- **Issue**: `getPriority` is defined inside the component, causing it to be recreated on every render.
- **Impact**: Unnecessary function recreation on each render, causing minor performance waste and violating React best practices. Note: [**React Compiler**](https://react.dev/learn/react-compiler) can automatically optimize this without manual memoization.
- **Fix**: Move `getPriority` outside the component (Option 1 - recommended for pure functions with no dependencies) OR wrap with `useCallback` (Option 2 - if it needs access to props/state as dependencies). In this case, we can apply both solutions.

### E. TypeScript/Code Quality Issues

#### 12. Using `any` Type

**Problematic code:**

```typescript
// Use `any`
const getPriority = (blockchain: any): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};
```

**Fixed code (Option 1 - Explicitly use `string` type for blockchain parameter):**

```typescript
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};
```

**Fixed code (Option 2 - Define blockchain enum with object lookup):**

```typescript
enum Blockchain {
  Osmosis = "Osmosis",
  Ethereum = "Ethereum",
  Arbitrum = "Arbitrum",
  Zilliqa = "Zilliqa",
  Neo = "Neo",
}

// Use object lookup (O(1) average) instead of switch (O(1) best case, O(n) worst case)
const BLOCKCHAIN_PRIORITIES: Record<Blockchain, number> = {
  [Blockchain.Osmosis]: 100,
  [Blockchain.Ethereum]: 50,
  [Blockchain.Arbitrum]: 30,
  [Blockchain.Zilliqa]: 20,
  [Blockchain.Neo]: 20,
};

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

const getPriority = (blockchain: Blockchain): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
};
```

- **Issue**: `getPriority` parameter uses `any` type instead of a specific type.
- **Impact**: Loses type safety benefits - any value can be passed without type checking.
- **Fix**:
  - **Option 1**: Use `string` type instead of `any`: `(blockchain: string): number`
  - **Option 2**: For stronger type safety, define a blockchain enum and use it for both the parameter and object lookup (shown in Fixed code Option 2 above)

#### 13. Empty Props Interface

**Problematic code:**

```typescript
interface Props extends BoxProps {
  // Empty - adds nothing
}

const WalletPage: React.FC<Props> = (props: Props) => {
  // ...
};
```

**Fixed code:**

```typescript
// Simply use BoxProps directly
const WalletPage: React.FC<BoxProps> = (props) => {
  const { children, ...rest } = props;
  // ...
};
```

- **Issue**: `Props` extends `BoxProps` but adds nothing.
- **Impact**: Unnecessary interface declaration that adds no value.
- **Fix**: Directly use `BoxProps` in the component declaration, or remove if no extension is needed.

#### 14. Redundant Type Annotation

**Problematic code:**

```typescript
const WalletPage: React.FC<Props> = (props: Props) => {
  //                                        ^^^^^^ Redundant!
  // React.FC<Props> already types the props parameter
  const { children, ...rest } = props;
  // ...
};
```

**Fixed code (Option 1 - Remove redundant annotation):**

```typescript
const WalletPage: React.FC<BoxProps> = (props) => {
  const { children, ...rest } = props;
  // ...
};
```

**Fixed code (Option 2 - Remove React.FC):**

```typescript
const WalletPage = (props: BoxProps) => {
  const { children, ...rest } = props;
  // ...
};
```

- **Issue**: `props: Props` parameter type when component is already declared as `React.FC<Props>`.
- **Impact**: Redundant type annotation - React.FC already provides the props type.
- **Fix**: Use either `(props)` without explicit typing (when using `React.FC<BoxProps>`) OR use explicit parameter typing `(props: BoxProps)` without `React.FC`. Don't declare the type in both places.

#### 15. Duplicated Properties in Interface

**Problematic code:**

```typescript
interface WalletBalance {
  currency: string;
  amount: number;
}

interface FormattedWalletBalance {
  currency: string; // Duplicated from WalletBalance
  amount: number; // Duplicated from WalletBalance
  formatted: string;
}
```

**Fixed code:**

```typescript
interface WalletBalance {
  currency: string;
  amount: number;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}
```

- **Issue**: `FormattedWalletBalance` duplicates `currency` and `amount` properties instead of extending `WalletBalance`.
- **Impact**: Code duplication and maintenance issues - if `WalletBalance` properties change, `FormattedWalletBalance` must be updated separately.
- **Fix**: Use interface extension: `interface FormattedWalletBalance extends WalletBalance` to inherit properties and avoid duplication.

#### 16. Missing Component Export

**Problematic code:**

```typescript
const WalletPage: React.FC<Props> = (props: Props) => {
  // ... component implementation
  return <div {...rest}>{rows}</div>;
};
// No export statement!
```

**Fixed code:**

```typescript
const WalletPage = ({ children, ...rest }: BoxProps) => {
  // ... component implementation
  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
```

- **Issue**: `WalletPage` component is not exported, making it inaccessible to other modules.
- **Impact**: Component cannot be imported and used in other parts of the application.
- **Fix**: Add `export default WalletPage;` at the end of the file to make the component available for import.

## Refactored Code

```typescript
enum Blockchain {
  Osmosis = "Osmosis",
  Ethereum = "Ethereum",
  Arbitrum = "Arbitrum",
  Zilliqa = "Zilliqa",
  Neo = "Neo",
}

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface WalletBalanceWithPriority extends WalletBalance {
  priority: number;
}

const BLOCKCHAIN_PRIORITIES: Record<Blockchain, number> = {
  [Blockchain.Osmosis]: 100,
  [Blockchain.Ethereum]: 50,
  [Blockchain.Arbitrum]: 30,
  [Blockchain.Zilliqa]: 20,
  [Blockchain.Neo]: 20,
};

const getPriority = (blockchain: Blockchain): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
};

const WalletPage = ({ children, ...rest }: BoxProps) => {
  const balances = useWalletBalances();
  const prices = usePrices();
  const classes = useStyles();

  // Cached balances with priority
  const balancesWithPriority: WalletBalanceWithPriority[] = useMemo(() => {
    return balances.map((balance: WalletBalance) => ({
      ...balance,
      priority: getPriority(balance.blockchain),
    }));
  }, [balances]);

  // Sorted balances using cached priorities
  const sortedBalances: WalletBalanceWithPriority[] = useMemo(() => {
    return balancesWithPriority
      .filter((balance) => balance.priority > -99 && balance.amount > 0)
      .sort((lhs, rhs) => rhs.priority - lhs.priority);
  }, [balancesWithPriority]);

  // Rendered rows
  const rows = useMemo(() => {
    return sortedBalances.map((balance: WalletBalanceWithPriority) => {
      const formatted = balance.amount.toFixed();
      const usdValue = prices[balance.currency] * balance.amount;

      return (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formatted}
        />
      );
    });
  }, [sortedBalances, prices, classes]);

  return <div {...rest}>{rows}</div>;
};

const useStyles = makeStyles((theme) => ({
  row: {
    // Example styles
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

export default WalletPage;
```
