import * as http from 'http';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Server} from '../models/ServerModel';
import {isGameId} from '../../common/Types';
import {Game} from '../Game';

export class ApiGame extends Handler {
  public static readonly INSTANCE = new ApiGame();
  private constructor() {
    super();
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    const gameId = ctx.url.searchParams.get('id');
    if (!gameId) {
      ctx.route.badRequest(req, res, 'missing id parameter');
      return;
    }

    let game: Game | undefined;
    if (isGameId(gameId)) {
      game = await ctx.gameLoader.getGame(gameId);
    }
    if (game === undefined) {
      ctx.route.notFound(req, res, 'game not found');
      return;
    }
    const model = Server.getSimpleGameModel(game);
    ctx.route.writeJson(res, model);
  }
}
