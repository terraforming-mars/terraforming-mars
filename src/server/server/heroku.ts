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
  const port = deArray(req.headers['x-forwarded-port']);
  if (address === undefined) {
    return undefined;
  }
  if (port === undefined) {
    return address;
  }
  return address + ':' + port;
}
