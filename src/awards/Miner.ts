import {IAward} from './IAward';
import {Player} from '../Player';
import {Phase} from '../Phase';
import {Resources} from '../Resources';

export class Miner implements IAward {
    public name: string = 'Miner';
    public description: string = 'Having the most steel and titanium resource cubes'
    public getScore(player: Player): number {
      if (player.game.phase === Phase.END || player.game.isDoneWithFinalProduction()) {
        return player.steel + player.titanium;
      } else {
        return player.steel + player.getProduction(Resources.STEEL) + player.titanium + player.getProduction(Resources.TITANIUM);
      }
    }
}
