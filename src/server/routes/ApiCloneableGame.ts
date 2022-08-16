import * as http from 'http';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {isGameId} from '../../common/Types';

export class ApiCloneableGame extends Handler {
  public static readonly INSTANCE = new ApiCloneableGame();
  private constructor() {
    super();
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    const gameId = ctx.url.searchParams.get('id');
    if (gameId === null) {
      ctx.route.badRequest(req, res, 'missing id parameter');
      return;
    }
    if (!isGameId(gameId)) {
      ctx.route.badRequest(req, res, 'invalid game id');
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
