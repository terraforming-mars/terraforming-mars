/**
 * Returns a new array consisting of elements only in both a and b.
 *
 * @param {Array<T>} a: the first array
 * @param {Array<T>} b: the second array
 * @return {Array<T>} the intersection of both array elements
 */
export function intersection<T>(a: Array<T>, b: Array<T>): Array<T> {
    return a.filter((e) => b.includes(e));
  }
  