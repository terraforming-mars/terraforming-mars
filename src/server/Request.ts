
import type * as http from 'http';
import type * as net from 'net';

/**
 * Limits Request to what we use. This is used to ease in unit testing
 * and to allow for javascript without 'http' to run the server code.
 */
export type Request = Pick<http.IncomingMessage, 'headers' | 'method' | 'url'> & {
  /**
   * Registers a listener that runs at most once.
   *
   * 'end' means the body arrived whole. 'error' and 'close' are the ways it does not.
   *
   * @see https://nodejs.org/docs/latest/api/events.html#emitteronceeventname-listener
   */
  once: (type: 'end' | 'error' | 'close', func: (err?: Error) => void) => void;
  /**
   * Registers a listener for every chunk of the body.
   *
   * @see https://nodejs.org/docs/latest/api/stream.html#event-data
   */
  on: (type: 'data', func: (dat: Buffer) => void) => void;
  /**
   * Stops 'data' events, applying TCP backpressure to the sender.
   *
   * @see https://nodejs.org/docs/latest/api/stream.html#readablepause
   */
  pause: () => void;
  /**
   * The connection the request arrived on.
   *
   * @see https://nodejs.org/docs/latest/api/http.html#messagesocket
   */
  socket: {
    address(): string | {} | net.AddressInfo;
  }
};

