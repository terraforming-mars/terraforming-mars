import {Tag} from './Tag';

// An intentionally small reduced version of Countable,
// which means this can be passed to Counter.
export interface IVictoryPoints {
  tag?: Tag,
  tag2?: Tag,
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
  per2?: number,
}

