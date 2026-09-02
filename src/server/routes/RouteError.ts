/* The failures a route can report without knowing how they're written to the wire. */
export type RouteErrorKind = 'badRequest' | 'contentTooLarge' | 'forbidden' | 'internalServerError' | 'notFound';

/**
 * A failure that maps to an HTTP status.
 *
 * Routes throw this instead of writing a response, so a handler can return its
 * declared response type on the happy path and nothing at all otherwise.
 */
export class RouteError extends Error {
  /* `detail` is appended to the response body. Kept apart from `message`, which always has a value. */
  constructor(public readonly kind: RouteErrorKind, public readonly detail?: string) {
    super(detail ?? kind);
  }

  public static badRequest(message?: string): RouteError {
    return new RouteError('badRequest', message);
  }

  public static contentTooLarge(message?: string): RouteError {
    return new RouteError('contentTooLarge', message);
  }

  public static forbidden(message?: string): RouteError {
    return new RouteError('forbidden', message);
  }

  public static internalServerError(message?: string): RouteError {
    return new RouteError('internalServerError', message);
  }

  public static notFound(message?: string): RouteError {
    return new RouteError('notFound', message);
  }
}
