import {Tag} from './Tag';

export interface IVictoryPoints {
  type: 'resource' | Tag,
  points: number,
  per: number,
}
