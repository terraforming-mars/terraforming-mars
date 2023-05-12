import {IAward} from './IAward';
import {Player} from '../Player';

export class Cultivator implements IAward {
  public readonly name = 'Cultivator';
  public readonly description = 'Own the most greenery tiles';
  public getScore(player: Player): number {
    return player.game.getGreeneriesCount(player);
  }
}
