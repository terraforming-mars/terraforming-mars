import * as http from 'http';
import {AsyncHandler} from './Handler';
import {IContext} from './IHandler';
import {Server} from '../models/ServerModel';

export class ApiGame extends AsyncHandler {
  public static readonly INSTANCE = new ApiGame();
  private constructor() {
    super();
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    const gameId = ctx.url.searchParams.get('id');
    if (!gameId) {
      ctx.route.notFound(req, res, 'id parameter missing');
      return;
    }

    const game = await ctx.gameLoader.getByGameId(gameId, /* bypassCache */ false);
    if (game === undefined) {
      ctx.route.notFound(req, res, 'game not found');
      return;
    }
    const model = Server.getSimpleGameModel(game);
    ctx.route.writeJson(res, model);
  }
}
