import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';

export class Benefactor implements IAward {
  public readonly name = 'Benefactor';
  public readonly description = 'Highest terraform rating';
  public getScore(player: Player): number {
    const score = player.getTerraformRating();
    return score + getAdditionalScore(player);
  }
}
