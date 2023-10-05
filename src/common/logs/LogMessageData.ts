import {LogMessageDataType} from './LogMessageDataType';

export type LogMessageDataAttrs = {
  tags?: boolean,
}
export type LogMessageData = {
  type: LogMessageDataType;
  value: string;
  attrs?: LogMessageDataAttrs;
}
