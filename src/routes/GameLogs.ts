import * as http from 'http';

import {IContext} from './IHandler';
import {LogMessage} from '../common/logs/LogMessage';
import {LogMessageType} from '../common/logs/LogMessageType';

export class GameLogs {
  private getLogsForGeneration(messages: Array<LogMessage>, generation: number): Array<LogMessage> {
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
    const playerId = ctx.url.searchParams.get('id');
    if (playerId === null) {
      ctx.route.badRequest(req, res, 'must provide player id as the id parameter');
      return;
    }

    const generation = ctx.url.searchParams.get('generation');

    ctx.gameLoader.getByPlayerId(playerId, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res, 'game not found');
        return;
      }
      let logs: Array<LogMessage> | undefined;

      const messagesForPlayer = ((message: LogMessage) => message.playerId === undefined || message.playerId === playerId);

      // for most recent generation pull last 50 log messages
      if (generation === null || Number(generation) === game.generation) {
        logs = game.gameLog.filter(messagesForPlayer).slice(-50);
      } else { // pull all logs for generation
        logs = this.getLogsForGeneration(game.gameLog, Number(generation)).filter(messagesForPlayer);
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(logs));
    });
  }
}
