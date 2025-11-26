import {IAward} from '@/server/awards/IAward';
import {IPlayer} from '@/server/IPlayer';
import {CardResource} from '@/common/CardResource';

export class Zoologist implements IAward {
  public readonly name = 'Zoologist';
  public readonly description = 'Have the most animal resources';
  public getScore(player: IPlayer): number {
    return player.getResourceCount(CardResource.ANIMAL);
  }
}
