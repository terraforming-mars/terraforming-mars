import {IAward} from './IAward';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Contractor implements IAward {
  public readonly name = 'Contractor';
  public readonly description = 'Have the most building tags';
  public getScore(player: Player): number {
    return player.tags.count(Tag.BUILDING, 'award');
  }
}
