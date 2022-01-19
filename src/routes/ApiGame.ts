import * as http from 'http';
import {Game} from '../Game';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Server} from '../models/ServerModel';

export class ApiGame extends Handler {
  public static readonly INSTANCE = new ApiGame();
  private constructor() {
    super();
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const gameId = ctx.url.searchParams.get('id');
    if (!gameId) {
      ctx.route.notFound(req, res, 'id parameter missing');
      return;
    }

    ctx.gameLoader.getByGameId(gameId, false, (game: Game | undefined) => {
      if (game === undefined) {
        ctx.route.notFound(req, res, 'game not found');
        return;
      }
      const model = Server.getSimpleGameModel(game);
      ctx.route.writeJson(res, model);
    });
  }
}
