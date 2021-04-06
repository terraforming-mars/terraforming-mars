import {IAward} from './IAward';
import {Player} from '../Player';
import {Phase} from '../Phase';
import {Resources} from '../Resources';

export class Industrialist implements IAward {
    public name: string = 'Industrialist';
    public description: string = 'Having most steel and energy resources'
    public getScore(player: Player): number {
      if (player.game.phase === Phase.END || player.game.isDoneWithFinalProduction()) {
        return player.steel + player.energy;
      } else {
        return player.steel + player.getProduction(Resources.STEEL) + player.getProduction(Resources.ENERGY);
      }
    }
}
