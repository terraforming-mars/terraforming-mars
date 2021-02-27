import * as http from 'http';
import * as querystring from 'querystring';
import {GameLoader} from '../database/GameLoader';
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
    const qs = req.url!.substring('/api/player?'.length);
    const queryParams = querystring.parse(qs);
    let playerId = queryParams['id'] as string | Array<string> | undefined;
    if (Array.isArray(playerId)) {
      playerId = playerId[0];
    }
    if (playerId === undefined) {
      playerId = '';
    }
    GameLoader.getInstance().getByPlayerId(playerId as string, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res);
        return;
      }
      let player: Player | undefined;
      try {
        player = game.getPlayerById(playerId as string);
      } catch (err) {
        console.warn(`unable to find player ${playerId}`, err);
      }
      if (player === undefined) {
        ctx.route.notFound(req, res);
        return;
      }
      ctx.route.writeJson(res, Server.getPlayerModel(player));
    });
  }
}
