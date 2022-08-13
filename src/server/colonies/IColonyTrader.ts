import {IColony} from './IColony';

// Something that can pay for trading with colonies.
export interface IColonyTrader {
  canUse(): boolean;
  optionText(): string;
  trade(colony: IColony): void;
}
