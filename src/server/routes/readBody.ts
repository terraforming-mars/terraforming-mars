import {Request} from '../Request';

/* Resolves once the whole request body has arrived. */
export function readBody(req: Request): Promise<string> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (data) => {
      body += data.toString();
    });
    req.once('end', () => resolve(body));
  });
}
