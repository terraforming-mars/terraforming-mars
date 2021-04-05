import {IAward} from './IAward';
import {Player} from '../Player';
import {Phase} from '../Phase';
import {Resources} from '../Resources';

export class Industrialist implements IAward {
    public name: string = 'Industrialist';
    public description: string = 'Having most steel and energy resources'
    public getScore(player: Player): number {
      if (player.game.phase === Phase.END) {
        return player.steel + player.energy;
      } else if (player.game.gameIsOver() && player.game.phase === Phase.PRODUCTION) {
        // This if check is for the final greenery placement step, we should calculate the score as if the game has end
        // because the final production already happened.
        return player.steel + player.energy;
      } else {
        return player.steel + player.getProduction(Resources.STEEL) + player.getProduction(Resources.ENERGY);
      }
    }
}
