import {Request} from '../../Request';

export const sessionIdCookieName = 'sessionId';
export function extract(req: Request) {
  const cookieHeader = req.headers.cookie;

  if (cookieHeader) {
    for (const cookie of cookieHeader.split(';')) {
      const [name, value] = cookie.trim().split('=');
      if (name === sessionIdCookieName) {
        return value;
      }
    }
  }
  return undefined;
}
