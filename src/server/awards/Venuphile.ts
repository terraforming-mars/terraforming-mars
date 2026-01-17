import {IAward} from '@/server/awards/IAward';
import {IPlayer} from '@/server/IPlayer';
import {Tag} from '@/common/cards/Tag';

export class Venuphile implements IAward {
  public readonly name = 'Venuphile';
  public readonly description = 'Have the most Venus tags in play';
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.VENUS, 'award');
  }
}
