import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';

export enum Priority {
  SPONSORED_ACADEMIES, // To discard before drawing
  DRAW_CARDS,
  BUILD_COLONY,
  DECREASE_ANY_PRODUCTION,
  DISCARD_CARDS,
  INCREASE_COLONY_TRACK,
  PLACE_CITY_TILE,
  PLACE_OCEAN_TILE,
  PLACE_GREENERY_TILE,
  PLACE_MOON_TILE,
  PLAY_PROJECT_CARD,
  REMOVE_ANY_PLANTS,
  REMOVE_RESOURCES_FROM_CARD,
  ADD_RESOURCES_TO_CARDS,
  SELECT_HOW_TO_PAY,
  SELECT_CARD_TO_KEEP,
  SEND_DELEGATE_TO_AREA,
  SELECT_PRODUCTION_TO_LOSE,
  STEAL_RESOURCES,
  DEFAULT,
}

export class DeferredAction {
  public priority: Priority = Priority.DEFAULT;
  constructor(
    public player: Player,
    public execute: () => PlayerInput | undefined,
  ) {}
}
