import {IAward} from './IAward';
import {Player} from '../Player';
import {Resources} from '../Resources';
import {Phase} from '../Phase';

export class Thermalist implements IAward {
    public name: string = 'Thermalist';
    public description: string = 'Having the most heat resource cubes'
    public getScore(player: Player): number {
      if (player.game.phase === Phase.END) {
        return player.heat;
      } else if (player.game.gameIsOver() && player.game.phase === Phase.PRODUCTION) {
        // This if check is for the final greenery placement step, we should calculate the score as if the game has end
        // because the final production already happened.
        return player.heat;
      } else {
        return player.energy + player.heat + player.getProduction(Resources.HEAT);
      }
    }
}
