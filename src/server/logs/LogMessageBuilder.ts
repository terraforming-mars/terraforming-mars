import {LogMessageType} from '../../common/logs/LogMessageType';
import {LogMessage} from '../../common/logs/LogMessage';
import {MessageBuilder} from './MessageBuilder';

// This is a terrible way to do extension, but given the local scope (this app)
// and the extra work in a delegate design pattern, this is fine.
//
export class LogMessageBuilder extends MessageBuilder {
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
