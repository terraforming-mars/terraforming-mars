import * as http from 'http';
import {Player} from '../Player';
import {Server} from '../server/ServerModel';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class ApiPlayer extends Handler {
  public static readonly INSTANCE = new ApiPlayer();

  private constructor() {
    super();
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const playerId = String(ctx.url.searchParams.get('id'));
    ctx.gameLoader.getByPlayerId(playerId, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res);
        return;
      }
      let player: Player | undefined;
      try {
        player = game.getPlayerById(playerId);
      } catch (err) {
        console.warn(`unable to find player ${playerId}`, err);
        ctx.route.notFound(req, res);
        return;
      }
      ctx.route.writeJson(res, Server.getPlayerModel(player));
    });
  }
}
