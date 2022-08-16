import * as http from 'http';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';


export class ApiStats extends Handler {
  public static readonly INSTANCE = new ApiStats();
  private constructor() {
    super({validateServerId: true});
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    try {
      const stats = await Database.getInstance().stats();
      ctx.route.writeJson(res, stats, 2);
    } catch (err) {
      console.error(err);
      ctx.route.badRequest(req, res, 'could not load admin stats');
    }
  }
}
