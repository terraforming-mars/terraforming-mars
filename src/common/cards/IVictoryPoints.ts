import {Tag} from './Tag';

// An intentionally reduced version of Countable,
// which means this can be passed to Counter and also sent to the client to redner.
export interface IVictoryPoints {
  tag?: Tag,
  resourcesHere?: {},
  cities?: {},
  moon?: {
    road?: {},
  }
  colonies?: {
    colonies?: {},
  }
  all?: boolean,
  each?: number,
  per?: number,
}
