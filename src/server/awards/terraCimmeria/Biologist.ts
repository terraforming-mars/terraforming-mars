import {Tag} from '@/common/cards/Tag';
import {IPlayer} from '@/server/IPlayer';
import {IAward} from '@/server/awards/IAward';

export class Biologist implements IAward {
  public readonly name = 'Biologist';
  public readonly description = 'Have the most animal, plant, and microbe tags in play';

  public getScore(player: IPlayer): number {
    return player.tags.multipleCount([Tag.MICROBE, Tag.PLANT, Tag.ANIMAL], 'award');
  }
}
