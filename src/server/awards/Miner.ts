import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';

export class Miner implements IAward {
  public readonly name = 'Miner';
  public readonly description = 'Having the most steel and titanium resource cubes (after final production round)';
  public getScore(player: Player): number {
    let score = 0;
    if (player.game.isDoneWithFinalProduction()) {
      score = player.steel + player.titanium;
    } else {
      score = player.steel + player.production.steel + player.titanium + player.production.titanium;
    }
    return score + getAdditionalScore(player);
  }
}
