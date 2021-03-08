import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Server} from '../server/ServerModel';

export class ApiWaitingFor extends Handler {
  public static readonly INSTANCE = new ApiWaitingFor();
  private constructor() {
    super();
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const playerId = String(ctx.url.searchParams.get('id'));
    const prevGameAge = Number(ctx.url.searchParams.get('prev-game-age'));
    ctx.gameLoader.getByPlayerId(playerId, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res, 'cannot find game for that player');
        return;
      }
      try {
        ctx.route.writeJson(res, Server.getWaitingForModel(game.getPlayerById(playerId), prevGameAge));
      } catch (err) {
        // This is basically impossible since getPlayerById ensures that the player is on that game.
        console.warn(`unable to find player ${playerId}`, err);
        ctx.route.notFound(req, res, 'player not found');
      }
    });
  }
}
