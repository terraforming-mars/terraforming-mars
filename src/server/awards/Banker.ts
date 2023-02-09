import {IAward} from './IAward';
import {Player} from '../Player';

export class Banker implements IAward {
  public readonly name = 'Banker';
  public readonly description = 'Having the highest M€ production';
  public getScore(player: Player): number {
    return player.production.megacredits;
  }
}
