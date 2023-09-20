import * as http from 'http';
import {Handler} from './Handler';
import {Context} from './IHandler';

export class ApiIPs extends Handler {
  public static readonly INSTANCE = new ApiIPs();
  private constructor() {
    super({validateServerId: true});
  }

  public override get(_req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    ctx.route.writeJson(res, ctx.ipTracker.toJSON(), 2);
    return Promise.resolve();
  }
}
