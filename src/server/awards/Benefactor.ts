import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';

export class Benefactor implements IAward {
  public readonly name = 'Benefactor';
  public readonly description = 'Have the highest terraform rating';
  public getScore(player: IPlayer): number {
    return player.getTerraformRating();
  }
}
