import {IAward} from './IAward';
import {Player} from '../Player';

export class Miner implements IAward {
  public readonly name = 'Miner';
  public readonly description = 'Have the most steel and titanium (after final production round)';
  public getScore(player: Player): number {
    if (player.game.isDoneWithFinalProduction()) {
      return player.steel + player.titanium;
    } else {
      return player.steel + player.production.steel + player.titanium + player.production.titanium;
    }
  }
}
