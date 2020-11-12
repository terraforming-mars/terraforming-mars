import {LogMessageType} from './LogMessageType';
import {LogMessageData} from './LogMessageData';

export class LogMessage {
    public type: LogMessageType;
    public timestamp: number;
    public message: string;
    public data: Array<LogMessageData>;

    constructor(type: LogMessageType, message: string, data: Array<LogMessageData>) {
      this.type = type;
      this.timestamp = Date.now();
      this.message = message;
      this.data = data;
    }
}
