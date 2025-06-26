import {ICard} from '../cards/ICard';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {Behavior} from './Behavior';
import {TRSource} from '../../common/cards/TRSource';
import {ICounter} from './Counter';

export interface BehaviorExecutor {
  canExecute(behavior: Behavior, player: IPlayer, card: ICard, canAffordOptions?: CanAffordOptions): boolean;
  execute(behavior: Behavior, player: IPlayer, card: ICard): void;
  onDiscard(behavior: Behavior, player: IPlayer, _card: ICard): void;
  toTRSource(behavior: Behavior, ctx: ICounter): TRSource;
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
