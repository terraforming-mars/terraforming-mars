
import type * as http from 'http';

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

