import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Contractor implements IAward {
  public readonly name = 'Contractor';
  public readonly description = 'Having the most building tags in play';
  public getScore(player: Player): number {
    const score = player.tags.count(Tag.BUILDING, 'award');
    return score + getAdditionalScore(player);
  }
}
