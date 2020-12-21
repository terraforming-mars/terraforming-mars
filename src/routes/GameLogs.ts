
import * as http from 'http';
import * as querystring from 'querystring';

import {GameLoader} from '../database/GameLoader';
import {Route} from './Route';

export class GameLogs extends Route {
  public canHandle(url: string): boolean {
    return url.startsWith('/api/game/logs?');
  }
  public handle(req: http.IncomingMessage, res: http.ServerResponse): void {
    if (req.url === undefined) {
      console.warn('url not defined');
      this.notFound(req, res);
      return;
    }

    const params = querystring.parse(req.url.substring(req.url.indexOf('?') + 1));

    const id = params.id;
    const limit = params.limit;

    if (id === undefined || Array.isArray(id)) {
      this.badRequest(req, res);
      return;
    }

    GameLoader.getInstance().getByPlayerId(id, (game) => {
      if (game === undefined) {
        console.warn('game not found');
        this.notFound(req, res);
        return;
      }

      const log = game.gameLog;

      if (limit !== undefined && !Array.isArray(limit)) {
        const theLimit = parseInt(limit);
        if (isNaN(theLimit)) {
          this.badRequest(req, res);
          return;
        }
        if (log.length > theLimit) {
          log.splice(0, log.length - theLimit);
        }
      }

      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(log));
      res.end();
    });
  }
}
