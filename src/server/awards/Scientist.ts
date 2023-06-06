import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';

export class Scientist implements IAward {
  public readonly name = 'Scientist';
  public readonly description = 'Have the most science tags';
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.SCIENCE, 'award');
  }
}
