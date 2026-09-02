import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';

export class Zoologist implements IAward {
  public readonly name = 'Zoologist';
  public readonly description = 'Have the most animal resources';
  public getScore(player: IPlayer): number {
    return player.getResourceCount(CardResource.ANIMAL);
  }
}
