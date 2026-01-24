import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {Tag} from '../../../common/cards/Tag';

export class Electrician implements IAward {
  public readonly name = 'Electrician';
  public readonly description = 'Have the most power tags in play.';
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.POWER, 'award');
  }
}
