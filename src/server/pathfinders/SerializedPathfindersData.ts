import {PlayerId} from '../../common/Types';
import {PlanetaryTag} from './PathfindersData';

export type SerializedPathfindersData = {
  venus: number;
  earth: number;
  mars: number;
  jovian: number;
  moon: number;
  vps: Array<{id: PlayerId, tag: PlanetaryTag, points: number}>;
}
