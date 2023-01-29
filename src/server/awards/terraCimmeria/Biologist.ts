import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {IAward, getAdditionalScore} from '../IAward';

export class Biologist implements IAward {
  public readonly name = 'Biologist';
  public readonly description = 'Having the most animal, plant, and microbe tags in play';

  public getScore(player: Player): number {
    const score = player.tags.multipleCount([Tag.MICROBE, Tag.PLANT, Tag.ANIMAL], 'awards');
    return score + getAdditionalScore(player);
  }
}
