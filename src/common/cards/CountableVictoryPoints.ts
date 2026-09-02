import {Tag} from './Tag';

// An intentionally reduced version of Countable,
// which means this can be passed to Counter and also sent to the client to render.
export type CountableVictoryPoints = {
  tag?: Tag,
  resourcesHere?: {},
  cities?: {},
  oceans?: {},
  moon?: {
    mine?: {},
    road?: {},
  }
  colonies?: {
    colonies?: {},
  }
  /** Only count tiles adjacent to this card's placed tile. */
  nextToThis?: {},
  all?: boolean,
  each?: number,
  per?: number,
}
