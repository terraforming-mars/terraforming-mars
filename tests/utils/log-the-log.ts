import {setGameLog} from '../../src/server/Game';
import {LogMessage} from '../../src/common/logs/LogMessage';
import {formatMessage} from '../TestingUtils';


class LoggingArray extends Array<LogMessage> {
  override push(...items: Array<LogMessage>): number {
    for (const item of items) {
      console.warn(formatMessage(item));
    }
    return super.push(...items);
  }
}

setGameLog(() => {
  return new LoggingArray();
});
