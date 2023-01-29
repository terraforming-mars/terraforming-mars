import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';

export class Industrialist implements IAward {
  public readonly name = 'Industrialist';
  public readonly description = 'Having most steel and energy resources (after final production round)';
  public getScore(player: Player): number {
    let score = 0;
    if (player.game.isDoneWithFinalProduction()) {
      score = player.steel + player.energy;
    } else {
      score = player.steel + player.production.steel + player.production.energy;
    }
    return score + getAdditionalScore(player);
  }
}
