// HTTP Status Codes
export const statusCode = {
  movedPermanently: 301,
  notModified: 304,
  badRequest: 400,
  forbidden: 403,
  notFound: 404,
  tooManyRequests: 429,
  internalServerError: 500,
  ok: 200,
} as const;
