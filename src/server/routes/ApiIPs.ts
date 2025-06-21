import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';

export class ApiIPs extends Handler {
  public static readonly INSTANCE = new ApiIPs();
  private constructor() {
    super({validateServerId: true});
  }

  public override get(_req: Request, res: Response, ctx: Context): Promise<void> {
    responses.writeJson(res, ctx, ctx.ipTracker.toJSON(), 2);
    return Promise.resolve();
  }
}
