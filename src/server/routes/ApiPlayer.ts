import * as responses from '../server/responses';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';
import {RouteError} from './RouteError';

export class ApiPlayer extends Handler {
  public static readonly INSTANCE = new ApiPlayer();

  private constructor() {
    super();
  }

  public override async get(_req: Request, res: Response, ctx: Context): Promise<void> {
    const playerId = ctx.urlParams.playerId('id');
    const game = await ctx.gameLoader.getGame(playerId);
    if (game === undefined) {
      throw RouteError.notFound();
    }
    try {
      const player = game.getPlayerById(playerId);
      if (!this.isUser(player.user, ctx)) {
        throw RouteError.forbidden();
      }

      ctx.ipTracker.addParticipant(playerId, ctx.ip);
      responses.writeJson(res, ctx, Server.getPlayerModel(player));
    } catch (err) {
      console.warn(`unable to find player ${playerId}`, err);
      throw RouteError.notFound();
    }
  }
}
