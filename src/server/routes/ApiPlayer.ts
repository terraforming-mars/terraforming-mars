import {isPlayerId} from '../../common/Types';
import * as http from 'http';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {Context} from './IHandler';

export class ApiPlayer extends Handler {
  public static readonly INSTANCE = new ApiPlayer();

  private constructor() {
    super();
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: Context): Promise<void> {
    const playerId = ctx.url.searchParams.get('id');
    if (playerId === null) {
      ctx.route.badRequest(req, res, 'missing id parameter');
      return;
    }
    if (!isPlayerId(playerId)) {
      ctx.route.badRequest(req, res, 'invalid player id');
      return;
    }
    const game = await ctx.gameLoader.getGame(playerId);
    if (game === undefined) {
      ctx.route.notFound(req, res);
      return;
    }
    try {
      const player = game.getPlayerById(playerId);
      ctx.route.writeJson(res, Server.getPlayerModel(player));
    } catch (err) {
      console.warn(`unable to find player ${playerId}`, err);
      ctx.route.notFound(req, res);
      return;
    }
  }
}
