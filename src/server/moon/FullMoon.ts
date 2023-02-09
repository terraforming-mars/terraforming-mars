import {IAward} from '../awards/IAward';
import {Tag} from '../../common/cards/Tag';
import {Player} from '../Player';

export class FullMoon implements IAward {
  public readonly name = 'Full Moon';
  public readonly description = 'Having the most moon tags in play.';
  public getScore(player: Player): number {
    return player.tags.count(Tag.MOON, 'award');
  }
}
