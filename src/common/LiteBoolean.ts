/**
 * A light form of Boolean representing true or undefined.
 *
 * true | undefined is a useful way to represent booleans when writing JSON
 * because if the field is also optional. Instead of false, it takes
 * undefined, and then will be omitted when written to JSON, reducing
 * the amount of JSON serializes.
 */
export type LiteBoolean = true | undefined;

/**
 * Converts a boolean to a LiteBoolean by converting false values to
 * undefined ones.
 */
export function liteBoolean(b: boolean | undefined): LiteBoolean {
  return b === true ? b : undefined;
}
