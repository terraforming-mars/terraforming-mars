import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {Tag} from '../../../common/cards/Tag';

export class Investor implements IAward {
  public readonly name = 'Investor';
  public readonly description = 'Have the most Earth tags in play';
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.EARTH, 'award');
  }
}
