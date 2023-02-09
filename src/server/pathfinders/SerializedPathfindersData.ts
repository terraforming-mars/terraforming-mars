import {Tag} from '../../common/cards/Tag';
import {PlayerId} from '../../common/Types';

export type SerializedPathfindersData = {
  venus: number;
  earth: number;
  mars: number;
  jovian: number;
  moon: number;
  vps: Array<{id: PlayerId, tag: Tag, points: number}>;
}
