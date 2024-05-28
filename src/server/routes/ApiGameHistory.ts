import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {isGameId} from '../../common/Types';
import {Request} from '../Request';
import {Response} from '../Response';

export class ApiGameHistory extends Handler {
  public static readonly INSTANCE = new ApiGameHistory();
  private constructor() {
    super({validateServerId: true});
  }

  public override async get(req: Request, res: Response, ctx: Context): Promise<void> {
    const gameId = ctx.url.searchParams.get('id');
    if (!gameId) {
      responses.badRequest(req, res, 'missing id parameter');
      return;
    }

    if (!isGameId(gameId)) {
      responses.badRequest(req, res, 'Invalid game id');
      return;
    }
    try {
      const saveIds = await Database.getInstance().getSaveIds(gameId);
      responses.writeJson(res, [...saveIds].sort());
    } catch (err) {
      console.error(err);
      responses.badRequest(req, res, 'could not load admin stats');
    }
  }
}
