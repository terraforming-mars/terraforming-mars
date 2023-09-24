import {Request} from '../Request';
import {asArray} from '../../common/utils/utils';

export function getHerokuIpAddress(req: Request): string | undefined {
  const address = asArray(req.headers['x-forwarded-for'])[0];
  if (address === undefined) {
    return undefined;
  }
  return address;
}
