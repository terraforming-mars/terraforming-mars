import {IncomingMessage} from 'http';

function deArray<T>(input: T | Array<T>): T | undefined {
  if (!Array.isArray(input)) {
    return input;
  }
  if (input.length > 0) {
    return input[0];
  }
  return undefined;
}

export function getHerokuIpAddress(req: IncomingMessage): string | undefined {
  const address = deArray(req.headers['x-forwarded-for']);
  if (address === undefined) {
    return undefined;
  }
  return address;
}
