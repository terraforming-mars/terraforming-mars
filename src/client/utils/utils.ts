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
export function partition<T>(source: Array<T>, predicate: (t: T) => boolean): Array<Array<T>> {
  return source
    .reduce((result, element) => {
      result[predicate(element) ^ 1].push(element);
      return result;
    },
    [[], []]);
}
