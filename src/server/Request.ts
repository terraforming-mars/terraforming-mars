
import type * as http from 'http';
import type * as net from 'net';

/**
 * Limits Request to what we use. This is used to ease in unit testing
 * and to allow for javascript without 'http' to run the server code.
 */
export type Request = Pick<http.IncomingMessage, 'headers' | 'method' | 'url'> & {
  /**
   * @see EventListener.once
   *
   * https://nodejs.org/docs/latest/api/events.html#emitteronceeventname-listener
   *
   * 'end' means the body arrived whole. 'error' and 'close' are the ways
   * it does not.
   */
  once: (type: 'end' | 'error' | 'close', func: (err?: Error) => void) => void;
  /**
   * @see EventListener.on
   */
  on: (type: 'data', func: (dat: Buffer) => void) => void;
  /**
   * @see IncomingMessage.socket
   */
  socket: {
    address(): string | {} | net.AddressInfo;
  }
};

