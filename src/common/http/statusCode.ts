// HTTP Status Codes
export const statusCode = {
  /** 301: moved permanently */
  movedPermanently: 301,
  /** 304: not modified */
  notModified: 304,
  /** 400: bad request */
  badRequest: 400,
  /** 403: forbidden */
  forbidden: 403,
  /** 404: not found */
  notFound: 404,
  /** 429: too many requests */
  tooManyRequests: 429,
  /** 500: internal server error */
  internalServerError: 500,
  /** 200: ok */
  ok: 200,
} as const;
