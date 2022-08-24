import {IAward} from './IAward';
import {Player} from '../Player';

export class Miner implements IAward {
  public name: string = 'Miner';
  public description: string = 'Having the most steel and titanium resource cubes (after final production round)';
  public getScore(player: Player): number {
    if (player.game.isDoneWithFinalProduction()) {
      return player.steel + player.titanium;
    } else {
      return player.steel + player.production.steel + player.titanium + player.production.titanium;
    }
  }
}
