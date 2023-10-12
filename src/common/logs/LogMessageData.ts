import {LogMessageDataType} from './LogMessageDataType';

export type LogMessageDataAttrs = {
  tags?: boolean,
  cost?: boolean,
}
export type LogMessageData = {
  type: LogMessageDataType;
  value: string;
  attrs?: LogMessageDataAttrs;
}
