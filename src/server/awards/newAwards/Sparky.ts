import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {Tag} from '../../../common/cards/Tag';

export class Sparky implements IAward {
  public readonly name = 'Sparky';
  public readonly description = 'Have the most Power tags in play.';
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.POWER, 'award');
  }
}
