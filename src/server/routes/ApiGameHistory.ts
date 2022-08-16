import * as http from 'http';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {isGameId} from '../../common/Types';


export class ApiGameHistory extends Handler {
  public static readonly INSTANCE = new ApiGameHistory();
  private constructor() {
    super({validateServerId: true});
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    const gameId = ctx.url.searchParams.get('id');
    if (!gameId) {
      ctx.route.badRequest(req, res, 'missing id parameter');
      return;
    }

    if (!isGameId(gameId)) {
      ctx.route.badRequest(req, res, 'Invalid game id');
      return;
    }
    try {
      const saveIds = await Database.getInstance().getSaveIds(gameId);
      ctx.route.writeJson(res, [...saveIds].sort());
    } catch (err) {
      console.error(err);
      ctx.route.badRequest(req, res, 'could not load admin stats');
    }
  }
}
