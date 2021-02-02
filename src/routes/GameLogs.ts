
import * as http from 'http';
import * as querystring from 'querystring';

import {GameLoader} from '../database/GameLoader';
import {LogMessage} from '../LogMessage';
import {Route} from './Route';

export class GameLogs extends Route {
  public canHandle(url: string): boolean {
    return url.startsWith('/api/game/logs?');
  }

  public static getLogMessageIndexByGen(data: Array<LogMessage>, generation: number): number | undefined {
    let result = undefined;
    for (let i = 0; i < data.length; i++) {
      const logMsg: LogMessage = data[i];
      const isGen = logMsg.message.startsWith('Generation');
      if (isGen) {
        if (parseInt(logMsg.data[0].value) === generation) {
          result = i;
          break;
        }
      }
    }
    return result;
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
    const generation = params.generation;

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

      let log = [...game.gameLog];

      if (generation !== undefined && !Array.isArray(generation)) {
        const theGen = parseInt(generation);

        // find the index of the selected generation message
        const startIndex = GameLogs.getLogMessageIndexByGen(log, theGen) || 0;

        // find the next gen index
        const endIndex = GameLogs.getLogMessageIndexByGen(log, theGen + 1);

        // if no end, return all
        if (endIndex !== undefined) {
          log = log.slice(startIndex, endIndex);
        }
      // TODO(chosta): ignore limit if gen is chosen until a scrollToTop batch loading is implemented (a.k.a. lazy load 50 lines at a time when user scrolls back)
      } else {
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
      }

      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(log));
      res.end();
    });
  }
}
