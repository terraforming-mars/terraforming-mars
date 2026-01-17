import {IPlayer} from '@/server/IPlayer';
import {IAward} from '@/server/awards/IAward';

export class Blacksmith implements IAward {
  public readonly name = 'Blacksmith';
  public readonly description = 'Have the highest production of steel and titanium combined';

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.titanium;
  }
}
