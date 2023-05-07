import {IAward} from './IAward';
import {Player} from '../Player';

export class Industrialist implements IAward {
  public readonly name = 'Industrialist';
  public readonly description = 'Have most steel and energy (after final production round)';
  public getScore(player: Player): number {
    if (player.game.isDoneWithFinalProduction()) {
      return player.steel + player.energy;
    } else {
      return player.steel + player.production.steel + player.production.energy;
    }
  }
}
