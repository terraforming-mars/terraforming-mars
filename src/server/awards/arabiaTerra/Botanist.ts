import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';

export class Botanist implements IAward {
  public readonly name = 'Botanist';
  public readonly description = 'Have the most plant production';
  public getScore(player: IPlayer): number {
    return player.production.plants;
  }
}
