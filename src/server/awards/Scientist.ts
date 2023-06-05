import {IAward} from './IAward';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Scientist implements IAward {
  public readonly name = 'Scientist';
  public readonly description = 'Have the most science tags';
  public getScore(player: Player): number {
    return player.tags.count(Tag.SCIENCE, 'award');
  }
}
