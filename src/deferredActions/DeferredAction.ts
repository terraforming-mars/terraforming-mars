import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';

export enum Priority {
  DECLARE_CLONE_TAG, // Used for Pathfinders. First thing a player must do before further effects.
  COST, // Cost of a blue card action, or paying Reds costs. Must happen before the effects.
  OPPONENT_TRIGGER, // Any effect from one of your opponent's card that triggers during your turn.
  DISCARD_BEFORE_DRAW, // When you must discard before you can draw. Mars University, Sponsored Academies.
  DRAW_CARDS,
  BUILD_COLONY,
  INCREASE_COLONY_TRACK,
  PLACE_OCEAN_TILE,
  DEFAULT, // Anything that doesn't fit into another category.
  ATTACK_OPPONENT, // Effects that make your opponents lose resources or production.
  LOSE_AS_MUCH_AS_POSSIBLE, // Effects that make you lose resource or production "as much as possible". Pharmacy Union, Mons.
  GAIN_RESOURCE_OR_PRODUCTION,
  LOSE_RESOURCE_OR_PRODUCTION,
  DECREASE_COLONY_TRACK_AFTER_TRADE,
  DISCARD_CARDS,
}

export class DeferredAction {
  public queueId?: number;
  constructor(
    public player: Player,
    public execute: () => PlayerInput | undefined,
    public priority: Priority = Priority.DEFAULT,
  ) {}

  public static create(player: Player, priority: Priority, execute: () => PlayerInput | undefined): DeferredAction {
    return new DeferredAction(player, execute, priority);
  }
}
