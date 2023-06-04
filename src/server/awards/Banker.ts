import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';

export class Banker implements IAward {
  public readonly name = 'Banker';
  public readonly description = 'Have the most M€ production';
  public getScore(player: IPlayer): number {
    return player.production.megacredits;
  }
}
