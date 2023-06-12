import {LogBuilder} from './LogBuilder';
import {IPlayer} from '../IPlayer';

export interface Logger {
  log(message: string, f?: (builder: LogBuilder) => void, options?: {reservedFor?: IPlayer}): void;
}
