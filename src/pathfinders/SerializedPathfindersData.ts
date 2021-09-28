import {Tags} from '../cards/Tags';
import {PlayerId} from '../Player';

export interface SerializedPathfindersData {
  venus: number;
  earth: number;
  mars: number;
  jovian: number;
  moon: number;
  vps: Array<{id: PlayerId, tag: Tags, points: number}>;
}
