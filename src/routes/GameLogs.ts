
import * as http from 'http';
import * as querystring from 'querystring';

import {GameLoader} from '../database/GameLoader';
import {LogMessage} from '../LogMessage';
import {IContext} from './IHandler';

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
    const limit = params.limit;
    const generation = params.generation;

    if (id === undefined || Array.isArray(id)) {
      ctx.route.badRequest(req, res, 'invalid playerid');
      return;
    }

    GameLoader.getInstance().getByPlayerId(id, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res, 'game not found');
        return;
      }

      let log = game.gameLog;

      if (generation !== undefined && !Array.isArray(generation)) {
        const theGen = parseInt(generation);

        // find the index of the selected generation message
        const startIndex = GameLogs.getLogMessageIndexByGen(log, theGen);
        if (startIndex === undefined) {
          ctx.route.badRequest(req, res, 'cannot find specified generation');
          return;
        }

        // find the next gen index
        const endIndex = GameLogs.getLogMessageIndexByGen(log, theGen + 1, startIndex);

        // if no end, return all
        if (endIndex !== undefined) {
          log = log.slice(startIndex, endIndex);
        }
      // TODO(chosta): ignore limit if gen is chosen until a scrollToTop batch loading is implemented (a.k.a. lazy load 50 lines at a time when user scrolls back)
      } else {
        if (limit !== undefined && !Array.isArray(limit)) {
          const theLimit = parseInt(limit);
          if (isNaN(theLimit)) {
            ctx.route.badRequest(req, res);
            return;
          }
          if (log.length > theLimit) {
            log.splice(0, log.length - theLimit);
          }
        }
      }

      ctx.route.writeJson(res, log);
    });
  }
}
