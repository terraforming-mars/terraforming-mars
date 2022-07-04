import * as http from 'http';
import {AsyncHandler} from './Handler';
import {IContext} from './IHandler';
import {Database} from '../database/Database';
import {Metrics} from '../server/metrics';


export class ApiStats extends AsyncHandler {
  public static readonly INSTANCE = new ApiStats();
  private constructor() {
    super({validateServerId: true});
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    try {
      const metrics = Metrics.INSTANCE.get();
      const stats = await Database.getInstance().stats();
      ctx.route.writeJson(res, {metrics, stats}, 2);
    } catch (err) {
      console.error(err);
      ctx.route.badRequest(req, res, 'could not load admin stats');
    }
  }
}
