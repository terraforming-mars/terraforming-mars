/**
 * An Error caused by bad user input.
 *
 * At this point in time the only meaningful difference is that these errors aren't logged to the console.
 */
export class InputError extends Error {
  constructor(message: string) {
    super(message);
  }
}
