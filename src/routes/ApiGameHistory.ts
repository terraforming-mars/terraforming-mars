import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Database} from '../database/Database';


export class ApiGameHistory extends Handler {
  public static readonly INSTANCE = new ApiGameHistory();
  private constructor() {
    super({validateServerId: true});
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const gameId = ctx.url.searchParams.get('id');
    if (!gameId) {
      ctx.route.notFound(req, res, 'id parameter missing');
      return;
    }

    Database.getInstance().getSaveIds(gameId)
      .then((saveIds) => {
        ctx.route.writeJson(res, [...saveIds].sort());
      }).catch((err) => {
        console.error(err);
        ctx.route.badRequest(req, res, 'could not load admin stats');
      });
  }
}
