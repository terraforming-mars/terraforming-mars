import {ICard} from '../cards/ICard';
import {Player} from '../Player';
import {Behavior} from './Behavior';
import {TRSource} from '../../common/cards/TRSource';

export interface BehaviorExecutor {
  canExecute(behavior: Behavior, player: Player, card: ICard): boolean;
  execute(behavior: Behavior, player: Player, card: ICard): void;
  onDiscard(behavior: Behavior, player: Player, _card: ICard): void;
  toTRSource(behavior: Behavior): TRSource;
}

let _behaviorExecutor: BehaviorExecutor | undefined = undefined;

export function registerBehaviorExecutor(behaviorExecutor: BehaviorExecutor) {
  if (_behaviorExecutor !== undefined) {
    throw new Error('Cannot re-register the behavior executor.');
  }
  _behaviorExecutor = behaviorExecutor;
}

export function getBehaviorExecutor(): BehaviorExecutor {
  if (_behaviorExecutor === undefined) {
    throw new Error('no behavior executor registered.');
  }
  return _behaviorExecutor;
}
