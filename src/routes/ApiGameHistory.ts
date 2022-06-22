import * as http from 'http';
import {AsyncHandler} from './Handler';
import {IContext} from './IHandler';
import {Database} from '../database/Database';


export class ApiGameHistory extends AsyncHandler {
  public static readonly INSTANCE = new ApiGameHistory();
  private constructor() {
    super({validateServerId: true});
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    const gameId = ctx.url.searchParams.get('id');
    if (!gameId) {
      ctx.route.notFound(req, res, 'id parameter missing');
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
