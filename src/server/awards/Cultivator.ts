import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';

export class Cultivator implements IAward {
  public readonly name = 'Cultivator';
  public readonly description = 'Most greenery tiles';
  public getScore(player: Player): number {
    const score = player.game.getGreeneriesCount(player);
    return score + getAdditionalScore(player);
  }
}
