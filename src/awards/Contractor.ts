import {IAward} from './IAward';
import {Player} from '../Player';
import {Tags} from '../common/cards/Tags';

export class Contractor implements IAward {
  public name: string = 'Contractor';
  public description: string = 'Having the most building tags in play';
  public getScore(player: Player): number {
    return player.getTagCount(Tags.BUILDING, 'award');
  }
}
