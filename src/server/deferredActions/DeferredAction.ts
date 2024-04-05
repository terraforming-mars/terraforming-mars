import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {Priority} from './Priority';

export interface IDeferredAction <T = undefined> {
  player: IPlayer;
  priority: Priority;
  //TODO(ethandobbs) Remove this from the interface and make protected on the class
  execute(): PlayerInput | undefined;
  run(cb: () => void): void;
  andThen(cb: (param: T) => void): this;
}

export abstract class DeferredAction<T = undefined> implements IDeferredAction<T> {
  /** The callback function to be called after execution or return of a PlayerInput. */
  protected cb: (param: T) => PlayerInput | undefined | void = () => {};

  /** If 'andThen' has been called yet. Prevents the funtion from being called twice. */
  private callbackSet = false;

  constructor(
    /** The player responsible for the action */
    public player: IPlayer,
    /** Priority level in the queue */
    public priority: Priority = Priority.DEFAULT,
  ) {}

  /** Execute the behavior of the deferred action and possibly return a player input */
  public abstract execute(): PlayerInput | undefined;

  /** Execute the action, then run the callback function */
  public run(cb: () => void): void {
    const input = this.execute();
    if (input !== undefined) {
      this.player.setWaitingFor(input, cb);
    } else {
      cb();
    }
  }

  /** Stores cb, to be called after this deferred action completes. */
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
