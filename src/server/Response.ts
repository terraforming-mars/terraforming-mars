
import type * as http from 'http';

/**
 * Limits Response to what we use. This is used to ease in unit testing
 * and to allow for javascript without 'http' to run the server code.
 */
export type Response = Pick<http.ServerResponse, 'setHeader' | 'write' | 'writeHead'> & {
  end: (data?: string | Buffer) => void;
};
