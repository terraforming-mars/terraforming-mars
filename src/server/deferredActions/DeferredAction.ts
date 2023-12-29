import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';

export enum Priority {
  /** Legacy value that should not be further used. */
  SUPERPOWER = -1,
  /** Used for Pathfinders. First thing a player must do before further effects. */
  DECLARE_CLONE_TAG,
  /** Cost of a blue card action, or paying Reds costs. Must happen before the effects. */
  COST,
  /** Any effect from one of your opponent's card that triggers during your turn. */
  OPPONENT_TRIGGER,

  /** When you must discard before you can draw. Making a determination that Sponsored Academies should come before Mars U. */
  SPONSORED_ACADEMIES,
  /** When you must discard before you can draw. Mars U, Ender (CEO). */
  DISCARD_AND_DRAW,
  DRAW_CARDS,
  BUILD_COLONY,
  INCREASE_COLONY_TRACK,
  PLACE_OCEAN_TILE,
  IDENTIFY_UNDERGROUND_RESOURCE,
  EXCAVATE_UNDERGROUND_RESOURCE,

  /** Anything that doesn't fit into another category. */
  DEFAULT,
  /** Effects that make your opponents lose resources or production. */
  ATTACK_OPPONENT,
  /** Effects that make you lose resource or production "as much as possible". Pharmacy Union, Mons. */
  LOSE_AS_MUCH_AS_POSSIBLE,
  GAIN_RESOURCE_OR_PRODUCTION,
  LOSE_RESOURCE_OR_PRODUCTION,
  DECREASE_COLONY_TRACK_AFTER_TRADE,
  DISCARD_CARDS,
  BACK_OF_THE_LINE,
}

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
  public cb: (param: T) => void = () => {};
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
