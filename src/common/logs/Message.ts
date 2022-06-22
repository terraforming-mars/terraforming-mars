import {LogMessageData} from './LogMessageData';

export interface Message {
  data: Array<LogMessageData>;
  message: string;
}
