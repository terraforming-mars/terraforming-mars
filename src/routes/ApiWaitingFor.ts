import * as http from 'http';
import * as querystring from 'querystring';
import {GameLoader} from '../database/GameLoader';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Server} from '../server/ServerModel';

export class ApiWaitingFor extends Handler {
  public static readonly INSTANCE = new ApiWaitingFor();
  private constructor() {
    super();
  }


  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const qs: string = req.url!.substring('/api/waitingfor?'.length);
    const queryParams = querystring.parse(qs);
    const playerId = (queryParams as any)['id'];
    const prevGameAge = parseInt((queryParams as any)['prev-game-age']);

    GameLoader.getInstance().getByPlayerId(playerId, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res, 'cannot find game for that player');
        return;
      }
      try {
        const player = game.getPlayerById(playerId);
        if (player !== undefined) {
          ctx.route.writeJson(res, Server.getWaitingForModel(player, prevGameAge));
        } else {
          ctx.route.notFound(req, res, 'player not found');
        }
      } catch (err) {
        // This is basically impossible since getPlayerById ensures that the player is on that game.
        console.warn(`unable to find player ${playerId}`, err);
      }
    });
  }
}
