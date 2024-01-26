import * as responses from './responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {Request} from '../Request';
import {Response} from '../Response';

export class ApiStats extends Handler {
  public static readonly INSTANCE = new ApiStats();
  private constructor() {
    super({validateStatsId: true});
  }

  public override async get(req: Request, res: Response, _ctx: Context): Promise<void> {
    try {
      const stats = await Database.getInstance().stats();
      responses.writeJson(res, stats, 2);
    } catch (err) {
      console.error(err);
      responses.badRequest(req, res, 'could not load admin stats');
    }
  }
}
