import {LogMessageData} from './common/logs/LogMessageData';
import {Message} from './common/logs/Message';

export class Log {
  public static applyData(message: Message, cb: (datum: LogMessageData, idx: number) => string): string {
    return message.message.replace(/\$\{(\d{1,2})\}/gi, (_match, idx) => {
      return cb(message.data[idx], idx);
    });
  }
}
