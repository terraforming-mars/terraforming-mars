import {LogMessageType} from '../../common/logs/LogMessageType';
import {LogMessage} from '../../common/logs/LogMessage';
import {MessageBuilder} from './MessageBuilder';
import {From, isFromPlayer} from './From';

// This is a terrible way to do extension, but given the local scope (this app)
// and the extra work in a delegate design pattern, this is fine.
//
export class LogMessageBuilder extends MessageBuilder {
  from(from: From): void {
    if (isFromPlayer(from)) {
      this.player(from.player);
    } else if ('card' in from) {
      if (typeof (from.card) === 'object') {
        this.card(from.card);
      } else {
        this.cardName(from.card);
      }
    } else {
      if (typeof (from.globalEvent) === 'object') {
        this.globalEvent(from.globalEvent);
      } else {
        this.globalEventName(from.globalEvent);
      }
    }
  }
  private type: LogMessageType;

  constructor(message: string) {
    super(message);
    this.type = LogMessageType.DEFAULT;
  }

  public forNewGeneration(): this {
    this.type = LogMessageType.NEW_GENERATION;
    return this;
  }

  public build(): LogMessage {
    const message = this.getMessage();
    return new LogMessage(this.type, message.message, message.data);
  }
}
