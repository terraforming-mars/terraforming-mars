import {IAward} from './IAward';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Voyager implements IAward {
  public readonly name = 'Voyager';
  public readonly description = 'Have the most Jovian tags';

  public getScore(player: Player): number {
    return player.tags.count(Tag.JOVIAN, 'award');
  }
}
