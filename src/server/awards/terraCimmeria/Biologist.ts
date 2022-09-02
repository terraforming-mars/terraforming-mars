import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Biologist implements IAward {
  public readonly name = 'Biologist';
  public readonly description = 'Having the most Animal, Plant, and Microbe tags in play';

  public getScore(player: Player): number {
    return player.tags.count(Tag.MICROBE, 'award') + player.tags.count(Tag.PLANT, 'award') + player.tags.count(Tag.ANIMAL, 'award');
  }
}
