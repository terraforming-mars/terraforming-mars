import {LogMessageBuilder} from './LogMessageBuilder';
import {IPlayer} from '../IPlayer';

export interface Logger {
  log(message: string, f?: (builder: LogMessageBuilder) => void, options?: {reservedFor?: IPlayer}): void;
}
