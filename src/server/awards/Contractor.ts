import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';

export class Contractor implements IAward {
  public readonly name = 'Contractor';
  public readonly description = 'Have the most building tags in play';
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.BUILDING, 'award');
  }
}
