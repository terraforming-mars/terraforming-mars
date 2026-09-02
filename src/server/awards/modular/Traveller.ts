import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {Tag} from '../../../common/cards/Tag';

export class Traveller implements IAward {
  public readonly name = 'Traveller';
  public readonly description = 'Have the most Jovian and Earth tags in play combined';
  public getScore(player: IPlayer): number {
    return player.tags.multipleCount([Tag.JOVIAN, Tag.EARTH], 'award');
  }
}
