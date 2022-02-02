import {IAward} from './IAward';
import {Player} from '../Player';
import {Resources} from '../common/Resources';

export class Industrialist implements IAward {
  public name: string = 'Industrialist';
  public description: string = 'Having most steel and energy resources (after final production round)';
  public getScore(player: Player): number {
    if (player.game.isDoneWithFinalProduction()) {
      return player.steel + player.energy;
    } else {
      return player.steel + player.getProduction(Resources.STEEL) + player.getProduction(Resources.ENERGY);
    }
  }
}
