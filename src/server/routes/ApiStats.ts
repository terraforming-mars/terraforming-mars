import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {Request} from '../Request';
import {Response} from '../Response';
import {RouteError} from './RouteError';

export class ApiStats extends Handler {
  public static readonly INSTANCE = new ApiStats();
  private constructor() {
    super({validateStatsId: true});
  }

  public override async get(_req: Request, res: Response, ctx: Context): Promise<void> {
    try {
      const stats = await Database.getInstance().stats();
      responses.writeJson(res, ctx, stats, 2);
    } catch (err) {
      console.error(err);
      throw RouteError.badRequest('could not load admin stats');
    }
  }
}
