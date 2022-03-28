import {Tags} from './Tags';

export interface IVictoryPoints {
  type: 'resource' | Tags,
  points: number,
  per: number,
}
