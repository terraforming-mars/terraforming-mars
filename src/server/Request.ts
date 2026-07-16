
import type * as http from 'http';

/**
 * Limits Request to what we use. This is used to ease in unit testing
 * and to allow for javascript without 'http' to run the server code.
 */
export type Request = Pick<http.IncomingMessage, 'headers' | 'method' | 'url'> & {
  once: (type: 'end', func: () => void) => void;
  on: (type: 'data', func: (dat: Buffer) => void) => void;
  socket: {
    address(): string | {
      address: string;
      family: string;
      port: number;
    };
  }
};

