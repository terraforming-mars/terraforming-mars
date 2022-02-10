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
 * @return {Array<number>} an Array of numbers from 0 to n, inclusive.
 */
export const range = (n: number): Array<number> => Array.from(Array(n).keys());

/**
 * Returns a new array consisting of elements only in both and b.
 *
 * @param {Array<T>} a: the first array
 * @param {Array<T>} b: the second array
 * @return {Array<T>} the intersection of both array elements
 */
export function intersection<T>(a: Array<T>, b: Array<T>) {
  return a.filter((e) => b.includes(e));
};

export const generateClassString = (classes: Array<string>): string => classes.join(' ').trimStart();

// https://stackoverflow.com/questions/47914536/use-partial-in-nested-property-with-typescript
// Recursive partials are useful for nested partial objects.
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export function isPlayerId(id: string): boolean {
  return id.charAt(0) === 'p';
}

export function isSpectatorId(id: string): boolean {
  return id.charAt(0) === 's';
}
