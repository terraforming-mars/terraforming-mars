
import * as http from 'http';

import {GameLoader} from '../database/GameLoader';
import {IContext} from './IHandler';

export class GameLogs {
  public handle(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    if (req.url === undefined) {
      ctx.route.notFound(req, res, 'url not defined');
      return;
    }

    const id = ctx.url.searchParams.get('id');

    if (id === null) {
      ctx.route.badRequest(req, res, 'invalid playerid');
      return;
    }

    GameLoader.getInstance().getByPlayerId(id, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res, 'game not found');
        return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(game.gameLog.slice(-50)));
    });
  }
}
