import {IAward} from '@/server/awards/IAward';
import {IPlayer} from '@/server/IPlayer';
import {Tag} from '@/common/cards/Tag';

export class Voyager implements IAward {
  public readonly name = 'Voyager';
  public readonly description = 'Have the most Jovian tags in play';

  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.JOVIAN, 'award');
  }
}
