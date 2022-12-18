import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Venuphile implements IAward {
  public readonly name = 'Venuphile';
  public readonly description = 'Having the most Venus tags in play';
  public getScore(player: Player): number {
    const score = player.tags.count(Tag.VENUS, 'award');
    return score + getAdditionalScore(player);
  }
}
