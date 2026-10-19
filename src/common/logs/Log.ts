import {LogMessageData} from './LogMessageData';
import {LogMessageDataType} from './LogMessageDataType';
import {Message} from './Message';

export class Log {
  /**
   * The markdown shortcode for resource data, e.g. `:p:megacredits:`, for plain-text logs.
   * Returns undefined for other data.
   */
  public static shortcode(datum: LogMessageData): string | undefined {
    switch (datum.type) {
    case LogMessageDataType.RESOURCE:
      return `:r:${datum.value}:`;
    case LogMessageDataType.PRODUCTION:
      return `:p:${datum.value}:`;
    case LogMessageDataType.CARD_RESOURCE:
      return `:cr:${datum.value.toLowerCase().replaceAll(' ', '-')}:`;
    default:
      return undefined;
    }
  }

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
