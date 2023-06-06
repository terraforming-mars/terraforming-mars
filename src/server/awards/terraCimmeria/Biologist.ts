import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';

export class Biologist implements IAward {
  public readonly name = 'Biologist';
  public readonly description = 'Have the most bio tags (animal, plant, and microbe tags count as bio tags.)';

  public getScore(player: IPlayer): number {
    return player.tags.multipleCount([Tag.MICROBE, Tag.PLANT, Tag.ANIMAL], 'award');
  }
}
