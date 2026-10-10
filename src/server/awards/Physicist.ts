import {IPlayer} from '@/server/IPlayer';
import {IAward} from '@/server/awards/IAward';
import {Tag} from '@/common/cards/Tag';

export class Physicist implements IAward {
  public readonly name = 'Physicist';
  public readonly description = 'Have the most science and space tags in play, combined.';

  public getScore(player: IPlayer): number {
    return player.tags.multipleCount([Tag.SCIENCE, Tag.SPACE], 'award');
  }
}
