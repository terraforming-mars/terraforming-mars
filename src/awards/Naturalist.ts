import {IAward} from './IAward';
import {Player} from '../Player';
import {Resources} from '../common/Resources';

export class Naturalist implements IAward {
  public name: string = 'Naturalist';
  public description: string = 'Most plant and heat production';

  public getScore(player: Player): number {
    return player.getProduction(Resources.HEAT) + player.getProduction(Resources.PLANTS);
  }
}
