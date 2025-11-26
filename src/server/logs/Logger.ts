import {LogMessageBuilder} from '@/server/logs/LogMessageBuilder';
import {IPlayer} from '@/server/IPlayer';

export interface Logger {
  log(message: string, f?: (builder: LogMessageBuilder) => void, options?: {reservedFor?: IPlayer}): void;
}
