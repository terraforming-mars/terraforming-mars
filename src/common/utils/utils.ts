import {OneOrArray} from './types';

export const playerColorClass = (color: string, type: 'shadow' | 'bg' | 'bg_transparent'): string => {
  const prefix = {
    shadow: 'player_shadow_color_',
    bg_transparent: 'player_translucent_bg_color_',
    bg: 'player_bg_color_',
  }[type];

  return `${prefix}${color}`;
};

/**
 * Creates a range from 0 to n.
 *
 * @param {number} n maximum value in the range.
 * @return {Array<number>} an Array of numbers from 0 to n-1, inclusive.
 */
export const range = (n: number): Array<number> => Array.from(Array(n).keys());

/**
 * Returns a new array consisting of elements only in both a and b.
 *
 * This preserves the order of the first array.
 *
 * @param {ReadonlyArray<T>} a: the first array
 * @param {ReadonlyArray<T>} b: the second array
 * @return {Array<T>} the intersection of both arrays
 */
export function intersection<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): Array<T> {
  return a.filter((e) => b.includes(e));
}

/**
 * Returns true if a includes an element of b.
 *
 * @param {Array<T>} a: the first array
 * @param {Array<T>} b: the second array
 * @return {Boolean} true if a includes an element of b.
 */
export function hasIntersection<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): boolean {
  return a.some((e) => b.includes(e));
}

/**
 * Returns elements in a that are not in b.
 *
 * @param {Array<T>} a: the first array
 * @param {Array<T>} b: the second array
 */
export function oneWayDifference<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): ReadonlyArray<T> {
  // Not optimized for large arrays.
  return a.filter((e) => !b.includes(e));
}

/**
 * Returns elements in neither A nor B.
 */
export function twoWayDifference<T>(a: Array<T>, b: Array<T>): Array<T> {
  return a
    .filter((x) => !b.includes(x))
    .concat(b.filter((x) => !a.includes(x)));
}


// https://stackoverflow.com/questions/47914536/use-partial-in-nested-property-with-typescript
// Recursive partials are useful for nested partial objects.
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

/**
 * Remove the `element` from `array`.
 */
export function inplaceRemove<T>(array: Array<T>, element: T): boolean {
  return inplaceRemoveIf(array, (e) => e === element) !== undefined;
}

export function inplaceRemoveIf<T>(array: Array<T>, predicate: (e: T) => boolean): T | undefined {
  const idx = array.findIndex(predicate);
  if (idx === -1) {
    return undefined;
  }
  const element = array[idx];
  array.splice(idx, 1);
  return element;
}

export function sum(array: ReadonlyArray<number>): number {
  return array.reduce((a, b) => a + b, 0);
}

/**
 * Creates an array of elements split into two groups,
 * the first of which contains elements predicate returns truthy for,
 * the second of which contains elements predicate returns falsey for.
 * The predicate is invoked with one argument: (value).
 *
 * @param {Array<T>} source The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array<Array<T>>} Returns the array of grouped elements. Passing group come first.
 */
export function partition<T>(source: ReadonlyArray<T>, predicate: (t: T) => boolean): Array<Array<T>> {
  return source.reduce((result: [Array<T>, Array<T>], element: T) => {
    result[predicate(element) ? 0 : 1].push(element);
    return result;
  }, [[], []]);
}

/**
 * Zip two arrays of equal length.
 *
 * Unexpected behavior if the arrays have different length.
 */
export function zip<S, T>(first: ReadonlyArray<S>, second: ReadonlyArray<T>): Array<[S, T]> {
  return first.map((e, i) => [e, second[i]]);
}

/**
 * Returns `elem` if it is an array. If it is not an array, returns `[elem]`
 */
export function asArray<T>(elem: OneOrArray<T>): Array<T> {
  return Array.isArray(elem) ? elem : [elem];
}
