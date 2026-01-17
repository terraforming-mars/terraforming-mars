import {IAward} from '@/server/awards/IAward';
import {IPlayer} from '@/server/IPlayer';

export class Banker implements IAward {
  public readonly name = 'Banker';
  public readonly description = 'Have the most M€ production';
  public getScore(player: IPlayer): number {
    return player.production.megacredits;
  }
}
