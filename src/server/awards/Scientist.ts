import {IAward} from '@/server/awards/IAward';
import {IPlayer} from '@/server/IPlayer';
import {Tag} from '@/common/cards/Tag';

export class Scientist implements IAward {
  public readonly name = 'Scientist';
  public readonly description = 'Have the most science tags in play';
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.SCIENCE, 'award');
  }
}
