import * as responses from '@/server/server/responses';
import {Handler} from '@/server/routes/Handler';
import {Context} from '@/server/routes/IHandler';
import {Database} from '@/server/database/Database';
import {Request} from '@/server/Request';
import {Response} from '@/server/Response';

export class ApiStats extends Handler {
  public static readonly INSTANCE = new ApiStats();
  private constructor() {
    super({validateStatsId: true});
  }

  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    try {
      const stats = await Database.getInstance().stats();
      responses.writeJson(res, ctx, stats, 2);
    } catch (err) {
      console.error(err);
      responses.badRequest(req, res, 'could not load admin stats');
    }
  }
}
