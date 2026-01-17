import {IAward} from '@/server/awards/IAward';
import {IPlayer} from '@/server/IPlayer';

export class Naturalist implements IAward {
  public readonly name = 'Naturalist';
  public readonly description = 'Have the most plant and heat production';

  public getScore(player: IPlayer): number {
    return player.production.heat + player.production.plants;
  }
}
