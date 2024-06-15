import {LogMessage} from '../../common/logs/LogMessage';
import {LogMessageType} from '../../common/logs/LogMessageType';
import {ParticipantId} from '../../common/Types';
import {IGame} from '../IGame';
import {Phase} from '../../common/Phase';
import {Log} from '../../common/logs/Log';
import {LogMessageData} from '../../common/logs/LogMessageData';
import {LogMessageDataType} from '../../common/logs/LogMessageDataType';

export class GameLogs {
  private getLogsForGeneration(messages: Array<LogMessage>, generation: number): Array<LogMessage> {
    let foundStart = generation === 1;
    const newMessages = [];
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

  public getLogsForGameView(playerId: ParticipantId, game: IGame, generation: string | null): Array<LogMessage> {
    const messagesForPlayer = ((message: LogMessage) => message.playerId === undefined || message.playerId === playerId);

    // for most recent generation pull last 50 log messages
    if (generation === null || Number(generation) === game.generation) {
      return game.gameLog.filter(messagesForPlayer).slice(-50);
    } else { // pull all logs for generation
      return this.getLogsForGeneration(game.gameLog, Number(generation)).filter(messagesForPlayer);
    }
  }

  public getLogsForGameEnd(game: IGame): Array<string> {
    if (game.phase !== Phase.END) {
      throw new Error('Game is not over');
    }

    return game.gameLog.map((message) => Log.applyData(message, (datum: LogMessageData) => {
      if (datum.type === undefined || datum.value === undefined) {
        return '';
      }

      switch (datum.type) {
      case LogMessageDataType.PLAYER:
        for (const player of game.getPlayers()) {
          if (datum.value === player.color) {
            return player.name;
          }
        }
        // Fall-back, show the player color.
        return datum.value;

      case LogMessageDataType.CARD:
      case LogMessageDataType.GLOBAL_EVENT:
      case LogMessageDataType.TILE_TYPE:
      case LogMessageDataType.COLONY:
      default:
        return datum.value.toString();
      }
    }));
  }
}
