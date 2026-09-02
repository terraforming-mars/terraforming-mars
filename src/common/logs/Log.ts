import {LogMessageData} from './LogMessageData';
import {Message} from './Message';

export class Log {
  public static applyData(message: Message, cb: (datum: LogMessageData, idx: number) => string): string {
    return message.message.replace(/\$\{(\d{1,2})\}/gi, (_match, idx) => {
      return cb(message.data[idx], idx);
    });
  }
  public static parse(message: Message): Array<string | LogMessageData> {
    // Regex that captures the placeholder strings like '${0}'
    const regex = /(\$\{\d+\})/g;
    const parsedArray = message.message.split(regex).filter(Boolean);

    return parsedArray.map((item) => {
      if (item.startsWith('${') && item.endsWith('}')) {
        const idx = Number(item.substring(2, item.length - 1));
        return message.data[idx];
      }
      return item;
    });
  }
}
