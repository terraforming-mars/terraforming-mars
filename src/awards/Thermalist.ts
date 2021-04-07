import {IAward} from './IAward';
import {Player} from '../Player';
import {Resources} from '../Resources';

export class Thermalist implements IAward {
    public name: string = 'Thermalist';
    public description: string = 'Having the most heat resource cubes (after final production round)'
    public getScore(player: Player): number {
      if (player.game.isDoneWithFinalProduction()) {
        return player.heat;
      } else {
        return player.energy + player.heat + player.getProduction(Resources.HEAT);
      }
    }
}
