import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {Request} from '../Request';
import {Response} from '../Response';
import {numeric} from '../../common/utils/Ordering';
import {RouteError} from './RouteError';

export class ApiGameHistory extends Handler {
  public static readonly INSTANCE = new ApiGameHistory();
  private constructor() {
    super({validateServerId: true});
  }

  public override async get(_req: Request, res: Response, ctx: Context): Promise<void> {
    const gameId = ctx.urlParams.gameId('id');
    try {
      const saveIds = await Database.getInstance().getSaveIds(gameId);
      responses.writeJson(res, ctx, saveIds.toSorted(numeric));
    } catch (err) {
      console.error(err);
      throw RouteError.badRequest('could not load admin stats');
    }
  }
}
