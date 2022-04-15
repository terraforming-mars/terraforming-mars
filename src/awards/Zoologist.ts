import {IAward} from './IAward';
import {Player} from '../Player';
import {CardResource} from '../common/CardResource';

export class Zoologist implements IAward {
  public name: string = 'Zoologist';
  public description: string = 'Having the most animal resources';
  public getScore(player: Player): number {
    return player.getResourceCount(CardResource.ANIMAL);
  }
}
