
import * as http from 'http';
import * as querystring from 'querystring';
import * as zlib from 'zlib';

import {GameLoader} from '../database/GameLoader';
import {LogMessage} from '../LogMessage';
import {Route} from './Route';

export class GameLogs extends Route {
  public canHandle(url: string): boolean {
    return url.startsWith('/api/game/logs?');
  }

  public static getLogMessageIndexByGen(data: Array<LogMessage>, generation: number, startIndex: number = 0): number | undefined {
    let counter = 0;
    for (let i = startIndex; i < data.length; i++) {
      const logMsg: LogMessage = data[i];
      if (logMsg.data.length > 0) {
        if (data[i].message === 'Generation ${0}') {
          counter++;
          if (counter === generation) {
            return i;
          }
        }
      } else {
        return undefined;
      }
    }
    return undefined;
  }

  public handle(req: http.IncomingMessage, res: http.ServerResponse): void {
    if (req.url === undefined) {
      console.warn('url not defined');
      this.notFound(req, res);
      return;
    }

    const params = querystring.parse(req.url.substring(req.url.indexOf('?') + 1));

    const id = params.id;

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

      const data = Buffer.from(JSON.stringify(game.gameLog));

      if (Route.supportsEncoding(req, 'gzip')) {
        zlib.gzip(data, (err, compressed) => {
          if (err !== null) {
            this.internalServerError(req, res, err);
            return;
          }
          res.setHeader('Content-Encoding', 'gzip');
          res.setHeader('Content-Type', 'application/json');
          res.end(compressed);
        });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      }
    });
  }
}
