import * as http from 'http';
import {AsyncHandler} from './Handler';
import {IContext} from './IHandler';
import {Database} from '../database/Database';

export class ApiCloneableGame extends AsyncHandler {
  public static readonly INSTANCE = new ApiCloneableGame();
  private constructor() {
    super();
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    const gameId = ctx.url.searchParams.get('id');
    if (!gameId) {
      ctx.route.badRequest(req, res, 'id parameter missing');
      return;
    }
    await Database.getInstance().getPlayerCount(gameId)
      .then((playerCount) => {
        ctx.route.writeJson(res, {gameId, playerCount});
      })
      .catch((err) => {
        console.warn('Could not load cloneable game: ', err);
        ctx.route.notFound(req, res);
      });
  }
}
