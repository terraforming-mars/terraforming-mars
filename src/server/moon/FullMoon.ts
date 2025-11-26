import {IAward} from '@/server/awards/IAward';
import {Tag} from '@/common/cards/Tag';
import {IPlayer} from '@/server/IPlayer';

export class FullMoon implements IAward {
  public readonly name = 'Full Moon';
  public readonly description = 'Have the most Moon tags in play';
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.MOON, 'award');
  }
}
