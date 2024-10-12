import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {Tag} from '../../../common/cards/Tag';

export class Traveller implements IAward {
  public readonly name = 'Traveller';
  public readonly description = 'Have the most Jovian and Earth tags in play.';
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.EARTH, 'award') + player.tags.count(Tag.JOVIAN, 'award');
  }
}
