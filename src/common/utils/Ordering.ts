/**
 * A comparison function, as accepted by `Array.prototype.sort` and `toSorted`.
 *
 * Returns a negative number when `a` sorts before `b`, a positive number when it sorts after,
 * and 0 when the two are equivalent.
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Sorts numbers in ascending order.
 *
 * `sort()` and `toSorted()` compare stringwise when given no comparator, so `[0, 1, 2, 10].sort()`
 * returns `[0, 1, 10, 2]`. Pass this instead.
 */
export const numeric: Comparator<number> = (a, b) => a - b;

/**
 * Sorts by the key `key` returns, in ascending order.
 *
 * Numeric and string keys are both supported.
 */
export function comparing<T>(key: (t: T) => number | string): Comparator<T> {
  return (a, b) => {
    const first = key(a);
    const second = key(b);
    if (first < second) {
      return -1;
    }
    if (first > second) {
      return 1;
    }
    return 0;
  };
}

/**
 * The properties of `T` that can be sorted on.
 */
type SortableKey<T> = {[K in keyof T]-?: T[K] extends number | string ? K : never}[keyof T];

/**
 * Sorts by the property named `key`, in ascending order.
 *
 * A shorthand for `comparing((t) => t[key])`. `T` comes from the surrounding context, so this
 * usually needs no type argument: `players.sort(byKey('megaCredits'))`.
 */
export function byKey<T>(key: SortableKey<T>): Comparator<T> {
  // TypeScript cannot narrow T[SortableKey<T>] on its own.
  return comparing((t) => t[key] as number | string);
}

/**
 * Sorts in the opposite order of `comparator`.
 */
export function reversed<T>(comparator: Comparator<T>): Comparator<T> {
  return (a, b) => comparator(b, a);
}

/**
 * Sorts by each comparator in turn, the first non-zero result winning.
 *
 * Elements no comparator distinguishes are equivalent.
 */
export function compound<T>(...comparators: ReadonlyArray<Comparator<T>>): Comparator<T> {
  return (a, b) => {
    for (const comparator of comparators) {
      const result = comparator(a, b);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  };
}

/**
 * Returns the greatest element of `items`, or undefined when `items` is empty.
 *
 * Ties go to the earliest element, which makes this equivalent to the first element of a
 * descending sort. Callers can rely on that to break ties by arranging `items` themselves.
 */
export function maxBy<T>(items: ReadonlyArray<T>, comparator: Comparator<T>): T | undefined {
  if (items.length === 0) {
    return undefined;
  }
  let best = items[0];
  for (let idx = 1; idx < items.length; idx++) {
    if (comparator(items[idx], best) > 0) {
      best = items[idx];
    }
  }
  return best;
}

/**
 * Returns the least element of `items`, or undefined when `items` is empty.
 *
 * Ties go to the earliest element, which makes this equivalent to the first element of an
 * ascending sort. Callers can rely on that to break ties by arranging `items` themselves.
 */
export function minBy<T>(items: ReadonlyArray<T>, comparator: Comparator<T>): T | undefined {
  if (items.length === 0) {
    return undefined;
  }
  let best = items[0];
  for (let idx = 1; idx < items.length; idx++) {
    if (comparator(items[idx], best) < 0) {
      best = items[idx];
    }
  }
  return best;
}
