import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';

export class Kingpin implements IAward {
  public readonly name = 'Kingpin';
  public readonly description = 'Have the most crime tags. (Event cards count)';
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.CRIME, 'raw-underworld');
  }
}
