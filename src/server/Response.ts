
import type * as http from 'http';

export type Response = Pick<http.ServerResponse, 'setHeader' | 'write' | 'writeHead'> & {
  end: (data?: string | Buffer) => void;
};
