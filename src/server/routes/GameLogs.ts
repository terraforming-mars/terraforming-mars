import {LogMessage} from '../../common/logs/LogMessage';
import {LogMessageType} from '../../common/logs/LogMessageType';
import {PlayerId, SpectatorId} from '../../common/Types';
import {Game} from '../Game';
import {Phase} from '../../common/Phase';
import {Log} from '../../common/logs/Log';

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

  public getLogsForGameView(playerId: PlayerId | SpectatorId, game: Game, generation: string | null): Array<LogMessage> {
    const messagesForPlayer = ((message: LogMessage) => message.playerId === undefined || message.playerId === playerId);

    // for most recent generation pull last 50 log messages
    if (generation === null || Number(generation) === game.generation) {
      return game.gameLog.filter(messagesForPlayer).slice(-50);
    } else { // pull all logs for generation
      return this.getLogsForGeneration(game.gameLog, Number(generation)).filter(messagesForPlayer);
    }
  }

  public getLogsForGameEnd(game: Game): Array<string> {
    if (game.phase !== Phase.END) {
      throw new Error('Game is not over');
    }

    return game.gameLog.map((message) => Log.applyData(message, (d) => d.value));
  }
}
