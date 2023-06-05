import {IAward} from './IAward';
import {Player} from '../Player';

export class Thermalist implements IAward {
  public readonly name = 'Thermalist';
  public readonly description = 'Have the most heat (after final production round)';
  public getScore(player: Player): number {
    if (player.game.isDoneWithFinalProduction()) {
      return player.heat;
    } else {
      return player.energy + player.heat + player.production.heat;
    }
  }
}
