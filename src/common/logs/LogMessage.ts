import {LogMessageType} from './LogMessageType';
import {LogMessageData} from './LogMessageData';
import {Message} from './Message';
import {PlayerId} from '../Types';

export class LogMessage implements Message {
  public timestamp = Date.now();
  public playerId?: PlayerId;
  constructor(
    public type: LogMessageType,
    public message: string,
    public data: Array<LogMessageData>,
    // When set, this message is private for the specifed player.
    // Always filter messages so they're not sent to the wrong player.
    playerId?: PlayerId) {
    // setting in body to avoid setting property when
    // argument is undefined for less memory usage
    if (playerId !== undefined) {
      this.playerId = playerId;
    }
  }
}

