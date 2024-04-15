import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {Priority} from './Priority';

export interface AndThen<T> {
  andThen(cb: (param: T) => void): this;
}

export interface IDeferredAction <T = undefined> extends AndThen<T> {
  queueId: number;
  player: IPlayer;
  priority: Priority;
  execute(): PlayerInput | undefined;
}

export abstract class DeferredAction<T = undefined> implements IDeferredAction<T> {
  // The position in the queue. Do not set directly.
  public queueId: number = -1;
  constructor(
    public player: IPlayer,
    public priority: Priority = Priority.DEFAULT,
  ) {}

  public abstract execute(): PlayerInput | undefined;
  // TODO(kberg): Make protected again.
  public cb: (param: T) => PlayerInput | undefined | void = () => {};
  private callbackSet = false;

  public andThen(cb: (param: T) => void): this {
    if (this.callbackSet) {
      throw new Error('Cannot call andThen twice for the same object.');
    }
    this.cb = cb;
    this.callbackSet = true;
    return this;
  }
}

export class SimpleDeferredAction<T> extends DeferredAction<T> {
  constructor(
    player: IPlayer,
    public execute: () => PlayerInput | undefined,
    priority?: Priority,
  ) {
    super(player, priority);
  }
}
