import {IAward} from './IAward';
import {Player} from '../Player';

export class Benefactor implements IAward {
  public readonly name = 'Benefactor';
  public readonly description = 'Highest terraform rating';
  public getScore(player: Player): number {
    return player.getTerraformRating();
  }
}
