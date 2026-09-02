import {Request} from '../Request';
import {RouteError} from './RouteError';

/**
 * Largest request body this server accepts by default, in bytes.
 *
 * The largest legitimate payload is a new game configuration, which runs to a few
 * kilobytes.
 */
export const DEFAULT_MAX_BODY_BYTES = 100_000;

/**
 * Hard ceiling on request body size, in bytes. A caller may ask `readBody` for a
 * smaller limit, never a larger one.
 */
export const MAX_BODY_BYTES = 1_000_000;

/**
 * Reads an entire request body, as UTF-8 text.
 *
 * Rejects with a `contentTooLarge` `RouteError` when the body is larger than `limit`, which is
 * itself capped at `MAX_BODY_BYTES`.
 */
export function readBody(req: Request, limit: number = DEFAULT_MAX_BODY_BYTES): Promise<string> {
  const cap = Math.min(limit, MAX_BODY_BYTES);
  const declared = Number(req.headers['content-length']);
  if (!isNaN(declared) && declared > cap) {
    return Promise.reject(RouteError.contentTooLarge(`Request body exceeds ${cap} bytes`));
  }

  return new Promise((resolve, reject) => {
    const chunks: Array<Buffer> = [];
    // Cumulative size
    let length = 0;
    // True when the promise is already decided (resolved or rejected)
    let settled = false;

    req.on('data', (data: Buffer<ArrayBufferLike>) => {
      if (settled) {
        return;
      }
      length += data.length;
      if (length > cap) {
        settled = true;
        chunks.length = 0;
        reject(RouteError.contentTooLarge(`Request body exceeds ${cap} bytes`));
        return;
      }
      chunks.push(data);
    });

    req.once('end', () => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
  });
}
