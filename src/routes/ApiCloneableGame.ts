import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Database} from '../database/Database';

export class ApiCloneableGame extends Handler {
  public static readonly INSTANCE = new ApiCloneableGame();
  private constructor() {
    super();
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const gameId = ctx.url.searchParams.get('id');
    if (!gameId) {
      ctx.route.badRequest(req, res, 'id parameter missing');
      return;
    }
    Database.getInstance().getClonableGameByGameId(gameId, function(err, gameData) {
      if (err) {
        console.warn('Could not load cloneable game: ', err);
        ctx.route.internalServerError(req, res, err);
        return;
      }
      if (gameData === undefined) {
        ctx.route.notFound(req, res);
        return;
      }
      ctx.route.writeJson(res, gameData);
    });
  }
}
