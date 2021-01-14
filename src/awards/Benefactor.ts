import {IAward} from './IAward';
import {Player} from '../Player';

export class Benefactor implements IAward {
    public name: string = 'Benefactor';
    public description: string = 'Highest terraform rating'
    public getScore(player: Player): number {
      return player.getTerraformRating();
    }
}
