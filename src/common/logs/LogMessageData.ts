import {LogMessageDataType} from './LogMessageDataType';

export class LogMessageData {
  constructor(public type: LogMessageDataType, public value: string) {}
}
