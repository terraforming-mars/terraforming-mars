import {LogBuilder} from './LogBuilder';
import {Player} from '../Player';

export interface Logger {
  log(message: string, f?: (builder: LogBuilder) => void, options?: {reservedFor?: Player}): void;
}
