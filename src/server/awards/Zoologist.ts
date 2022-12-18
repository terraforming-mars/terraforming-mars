import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';
import {CardResource} from '../../common/CardResource';

export class Zoologist implements IAward {
  public readonly name = 'Zoologist';
  public readonly description = 'Having the most animal resources';
  public getScore(player: Player): number {
    const score = player.getResourceCount(CardResource.ANIMAL);
    return score + getAdditionalScore(player);
  }
}
