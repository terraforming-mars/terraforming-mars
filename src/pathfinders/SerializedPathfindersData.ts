import {Tags} from '../common/cards/Tags';
import {PlayerId} from '../common/Types';

export interface SerializedPathfindersData {
  venus: number;
  earth: number;
  mars: number;
  jovian: number;
  moon: number;
  vps: Array<{id: PlayerId, tag: Tags, points: number}>;
}
