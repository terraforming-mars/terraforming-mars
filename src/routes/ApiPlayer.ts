import * as http from 'http';
import {Server} from '../models/ServerModel';
import {AsyncHandler} from './Handler';
import {IContext} from './IHandler';

export class ApiPlayer extends AsyncHandler {
  public static readonly INSTANCE = new ApiPlayer();

  private constructor() {
    super();
  }

  public override async get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    const playerId = String(ctx.url.searchParams.get('id'));
    const game = await ctx.gameLoader.getByParticipantId(playerId);
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
