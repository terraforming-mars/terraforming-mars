import {IAward} from '../awards/IAward';
import {Tag} from '../../common/cards/Tag';
import {Player} from '../Player';

export class FullMoon implements IAward {
  public name: string = 'Full Moon';
  public description: string = 'Having the most moon tags in play.';
  public getScore(player: Player): number {
    return player.tags.count(Tag.MOON, 'award');
  }
}
