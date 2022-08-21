import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Biologist implements IAward {
  public name: string = 'Biologist';
  public description: string = 'Having the most Animal, Plant, and Microbe tags in play';

  public getScore(player: Player): number {
    return player.tags.getTagCount(Tag.MICROBE, 'award') + player.tags.getTagCount(Tag.PLANT, 'award') + player.tags.getTagCount(Tag.ANIMAL, 'award');
  }
}
