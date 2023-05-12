import {IAward} from './IAward';
import {Player} from '../Player';
import {CardResource} from '../../common/CardResource';

export class Zoologist implements IAward {
  public readonly name = 'Zoologist';
  public readonly description = 'Have the most animal resources';
  public getScore(player: Player): number {
    return player.getResourceCount(CardResource.ANIMAL);
  }
}
