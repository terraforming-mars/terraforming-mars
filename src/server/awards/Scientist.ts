import {IAward} from './IAward';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Scientist implements IAward {
  public name: string = 'Scientist';
  public description: string = 'Having the most science tags in play';
  public getScore(player: Player): number {
    return player.tags.count(Tag.SCIENCE, 'award');
  }
}
