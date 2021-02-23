
import * as http from 'http';
import * as querystring from 'querystring';
import * as zlib from 'zlib';

import {GameLoader} from '../database/GameLoader';
import {LogMessage} from '../LogMessage';
import {IContext} from './IHandler';
import {Route} from './Route';

export class GameLogs {
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

  public handle(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    if (req.url === undefined) {
      ctx.route.notFound(req, res, 'url not defined');
      return;
    }

    const params = querystring.parse(req.url.substring(req.url.indexOf('?') + 1));

    const id = params.id;

    if (id === undefined || Array.isArray(id)) {
      ctx.route.badRequest(req, res, 'invalid playerid');
      return;
    }

    GameLoader.getInstance().getByPlayerId(id, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res, 'game not found');
        return;
      }

      const data = Buffer.from(JSON.stringify(game.gameLog));

      if (Route.supportsEncoding(req, 'br')) {
        zlib.brotliCompress(data, {
          params: {
            [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
            [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
            [zlib.constants.BROTLI_PARAM_SIZE_HINT]: data.length,
          },
        }, (err, compressed) => {
          if (err !== null) {
            this.internalServerError(req, res, err);
            return;
          }
          res.setHeader('Content-Encoding', 'br');
          res.setHeader('Content-Type', 'application/json');
          res.end(compressed);
        });
      } else if (Route.supportsEncoding(req, 'gzip')) {
        zlib.gzip(data, (err, compressed) => {
          if (err !== null) {
            ctx.route.internalServerError(req, res, err);
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
