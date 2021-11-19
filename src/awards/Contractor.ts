import {IAward} from './IAward';
import {Player} from '../Player';
import {Tags} from '../cards/Tags';

export class Contractor implements IAward {
    public name: string = 'Contractor';
    public description: string = 'Most building tags (event cards do not count)'
    public getScore(player: Player): number {
      return player.getTagCount(Tags.BUILDING, 'award');
    }
}
