import {Tag} from './Tag';

export interface IVictoryPoints {
  type: 'resource' | Tag,
  each: number,
  per: number,
}
