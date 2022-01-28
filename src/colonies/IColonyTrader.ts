import {Colony} from './Colony';

// Something that can pay for trading with colonies.
export interface IColonyTrader {
  canUse(): boolean;
  optionText(): string;
  trade(colony: Colony): void;
}
