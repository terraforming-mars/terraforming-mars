import {asArray} from '../../common/utils/utils';
import {IncomingMessage} from 'http';

export function getHerokuIpAddress(req: IncomingMessage): string | undefined {
  const address = asArray(req.headers['x-forwarded-for'])[0];
  if (address === undefined) {
    return undefined;
  }
  return address;
}
