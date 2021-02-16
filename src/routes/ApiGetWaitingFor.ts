import * as http from 'http';
import * as querystring from 'querystring';
import {GameLoader} from '../database/GameLoader';
import {Player} from '../Player';
import {Handler} from './Handler';
import {IContext} from './IHandler';
import {Server} from '../server/ServerModel';

export class ApiGetWaitingFor extends Handler {
  public static readonly INSTANCE = new ApiGetWaitingFor();
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
        ctx.route.notFound(req, res);
        return;
      }
      let player: Player | undefined;
      try {
        player = game.getPlayerById(playerId);
      } catch (err) {
        console.warn(`unable to find player ${playerId}`, err);
      }
      if (player === undefined) {
        ctx.route.notFound(req, res);
        return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(Server.getWaitingForModel(player, prevGameAge)));
    });
  }
}
