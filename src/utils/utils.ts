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
export const generateClassString = (classes: Array<string>): string => classes.join(' ').trimStart();

// https://stackoverflow.com/questions/47914536/use-partial-in-nested-property-with-typescript
// Recursive partials are useful for nested partial objects.
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
