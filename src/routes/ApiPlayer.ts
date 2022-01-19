import * as http from 'http';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class ApiPlayer extends Handler {
  public static readonly INSTANCE = new ApiPlayer();

  private constructor() {
    super();
  }

  public override get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const playerId = String(ctx.url.searchParams.get('id'));
    ctx.gameLoader.getByPlayerId(playerId, (game) => {
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
    });
  }
}
