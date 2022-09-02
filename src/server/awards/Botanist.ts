import {IAward} from './IAward';
import {Player} from '../Player';

export class Botanist implements IAward {
  public readonly name = 'Botanist';
  public readonly description = 'Having the highest plant production';
  public getScore(player: Player): number {
    return player.production.plants;
  }
}
