import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';

export class Thermalist implements IAward {
  public readonly name = 'Thermalist';
  public readonly description = 'Having the most heat resource cubes (after final production round)';
  public getScore(player: Player): number {
    let score = 0;
    if (player.game.isDoneWithFinalProduction()) {
      score = player.heat;
    } else {
      score = player.energy + player.heat + player.production.heat;
    }
    return score + getAdditionalScore(player);
  }
}
