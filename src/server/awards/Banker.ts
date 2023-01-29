import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';

export class Banker implements IAward {
  public readonly name = 'Banker';
  public readonly description = 'Having the highest M€ production';
  public getScore(player: Player): number {
    const score = player.production.megacredits;
    return score + getAdditionalScore(player);
  }
}
