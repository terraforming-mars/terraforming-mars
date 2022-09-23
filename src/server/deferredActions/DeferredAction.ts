import {Player} from '../Player';
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
  /** When you must discard before you can draw. Mars U */
  DISCARD_AND_DRAW,
  DRAW_CARDS,
  BUILD_COLONY,
  INCREASE_COLONY_TRACK,
  PLACE_OCEAN_TILE,
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
}

export abstract class DeferredAction {
  public queueId: number = -1;
  constructor(
    public player: Player,
    public priority: Priority = Priority.DEFAULT,
  ) {}

  public static create(player: Player, priority: Priority, execute: () => PlayerInput | undefined): DeferredAction {
    return new SimpleDeferredAction(player, execute, priority);
  }

  public abstract execute(): PlayerInput | undefined;
}

export class SimpleDeferredAction extends DeferredAction {
  constructor(
    player: Player,
    public execute: () => PlayerInput | undefined,
    priority?: Priority,
  ) {
    super(player, priority);
  }
}
