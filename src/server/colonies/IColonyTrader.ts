import {Message} from '@/common/logs/Message';
import {IColony} from './IColony';

/** Something that can pay for trading with colonies. */
export interface IColonyTrader {
  canUse(): boolean;
  optionText(): string | Message;
  trade(colony: IColony): void;
}
