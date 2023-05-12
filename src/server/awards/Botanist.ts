import {IAward} from './IAward';
import {Player} from '../Player';

export class Botanist implements IAward {
  public readonly name = 'Botanist';
  public readonly description = 'Have the most plant production';
  public getScore(player: Player): number {
    return player.production.plants;
  }
}
