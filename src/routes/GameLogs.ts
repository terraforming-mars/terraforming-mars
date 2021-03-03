
import * as http from 'http';

import {IContext} from './IHandler';
import {LogMessage} from '../LogMessage';
import {LogMessageType} from '../LogMessageType';

export class GameLogs {
  private getLogsForGeneration(messages: Array<LogMessage>, generation: number) {
    let foundStart = generation === 1;
    const newMessages: Array<LogMessage> = [];
    for (const message of messages) {
      if (message.type === LogMessageType.NEW_GENERATION) {
        const value = Number(message.data[0]?.value);
        if (value === generation) {
          foundStart = true;
        } else if (value === generation + 1) {
          break;
        }
      }
      if (foundStart === true) {
        newMessages.push(message);
      }
    }
    return newMessages;
  }

  public handle(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const id = ctx.url.searchParams.get('id');
    const generation = ctx.url.searchParams.get('generation');
    if (id === null) {
      ctx.route.badRequest(req, res, 'must provide playerid');
      return;
    }

    ctx.gameLoader.getByPlayerId(id, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res, 'game not found');
        return;
      }
      let logs: Array<LogMessage> | undefined;

      // for most recent generation pull last 50 log messages
      if (generation === null || Number(generation) === game.generation) {
        logs = game.gameLog.slice(-50);
      } else { // pull all logs for generation
        logs = this.getLogsForGeneration(game.gameLog, Number(generation));
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(logs));
    });
  }
}
