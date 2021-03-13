import {IAward} from '../awards/IAward';
import {Tags} from '../cards/Tags';
import {Player} from '../Player';

export class FullMoon implements IAward {
    public name: string = 'Lunar Magnate';
    public description: string = 'Having the most moon tags in play.'
    public getScore(player: Player): number {
      return player.getTagCount(Tags.MOON);
    }
}
